"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CompareTable,
  CtaButton,
  DecisionCard,
  Heading,
  SourceNote,
} from "@/components/ui";
import { trackCalculatorComplete } from "@/lib/affiliate-track";
import { CDG_CHECKED, cdgPlan, cdgSources } from "@/lib/cdg";
import {
  DEFAULT_INTERCHANGE,
  PROCESSOR_FEES_CHECKED,
  formatMoney,
  formatPercent,
  parseProcessorQuery,
  processorPresets,
  runCalculator,
  type Channel,
  type ProcessorPreset,
} from "@/lib/fee-calculator";

type FeeCalculatorProps = {
  initialProcessor?: string | null;
};

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-rule-strong bg-paper px-3 py-2.5 text-small text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action";

const labelClass = "block text-small font-semibold text-ink";

function parseNumber(raw: string): number {
  const cleaned = raw.replace(/[$,\s]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function FeeCalculator({ initialProcessor }: FeeCalculatorProps) {
  const fromQuery = parseProcessorQuery(initialProcessor ?? null);
  const [volumeRaw, setVolumeRaw] = useState("50000");
  const [ticketMode, setTicketMode] = useState<"avg" | "count">("avg");
  const [avgTicketRaw, setAvgTicketRaw] = useState("75");
  const [txnCountRaw, setTxnCountRaw] = useState("667");
  const [channel, setChannel] = useState<Channel>("card_not_present");
  const [processor, setProcessor] = useState<ProcessorPreset>(
    fromQuery ?? "stripe",
  );
  const [customPercentRaw, setCustomPercentRaw] = useState("2.9");
  const [customPerTxnRaw, setCustomPerTxnRaw] = useState("0.30");
  const [customMonthlyRaw, setCustomMonthlyRaw] = useState("0");
  const [overrideEnabled, setOverrideEnabled] = useState(false);
  const [effectiveRateRaw, setEffectiveRateRaw] = useState("");
  const [interchangeRaw, setInterchangeRaw] = useState(
    String(DEFAULT_INTERCHANGE.card_not_present),
  );

  const volume = parseNumber(volumeRaw);
  const avgTicket =
    ticketMode === "avg"
      ? parseNumber(avgTicketRaw)
      : volume > 0 && parseNumber(txnCountRaw) > 0
        ? volume / parseNumber(txnCountRaw)
        : 0;

  const result = useMemo(
    () =>
      runCalculator({
        volume,
        avgTicket,
        channel,
        processor,
        customPercent: parseNumber(customPercentRaw),
        customPerTxn: parseNumber(customPerTxnRaw),
        customMonthlyFee: parseNumber(customMonthlyRaw),
        effectiveRateOverride:
          overrideEnabled && parseNumber(effectiveRateRaw) > 0
            ? parseNumber(effectiveRateRaw)
            : null,
        assumedInterchange: parseNumber(interchangeRaw) || DEFAULT_INTERCHANGE[channel],
      }),
    [
      volume,
      avgTicket,
      channel,
      processor,
      customPercentRaw,
      customPerTxnRaw,
      customMonthlyRaw,
      overrideEnabled,
      effectiveRateRaw,
      interchangeRaw,
    ],
  );

  const trackedKey = useRef<string | null>(null);
  useEffect(() => {
    if (!result) return;
    const key = [
      result.volume,
      result.transactions.toFixed(2),
      result.channel,
      result.band,
      processor,
    ].join("|");
    if (trackedKey.current === key) return;
    trackedKey.current = key;
    trackCalculatorComplete({
      page: "/tools/fee-calculator",
      processor,
      channel: result.channel,
      volume_band: result.band,
      volume: result.volume,
    });
  }, [result, processor]);

  const presetSource =
    processor !== "custom" ? processorPresets[processor].source : null;
  const presetNote =
    processor !== "custom" ? processorPresets[processor].note : null;

  const flatPlan = cdgPlan("flatRate");
  const icPlan = cdgPlan("interchangePlus");
  const wholesalePlan = cdgPlan("wholesale");

  return (
    <div className="mt-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <Heading level={2} size="sm">
            Your volume and current fees
          </Heading>
          <p className="mt-2 text-small text-ink-soft">
            Enter monthly card volume and either average ticket or transaction
            count. Pick a channel and a public processor schedule, or enter a
            custom rate.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="volume" className={labelClass}>
                Monthly card volume ($)
              </label>
              <input
                id="volume"
                inputMode="decimal"
                className={fieldClass}
                value={volumeRaw}
                onChange={(e) => setVolumeRaw(e.target.value)}
                autoComplete="off"
              />
            </div>

            <fieldset>
              <legend className={labelClass}>Ticket size or count</legend>
              <div className="mt-2 flex flex-wrap gap-4 text-small text-ink-soft">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="ticketMode"
                    checked={ticketMode === "avg"}
                    onChange={() => setTicketMode("avg")}
                  />
                  Average transaction ($)
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="ticketMode"
                    checked={ticketMode === "count"}
                    onChange={() => setTicketMode("count")}
                  />
                  Transactions per month
                </label>
              </div>
              {ticketMode === "avg" ? (
                <input
                  id="avgTicket"
                  inputMode="decimal"
                  className={fieldClass}
                  value={avgTicketRaw}
                  onChange={(e) => setAvgTicketRaw(e.target.value)}
                  autoComplete="off"
                  aria-label="Average transaction size in dollars"
                />
              ) : (
                <input
                  id="txnCount"
                  inputMode="decimal"
                  className={fieldClass}
                  value={txnCountRaw}
                  onChange={(e) => setTxnCountRaw(e.target.value)}
                  autoComplete="off"
                  aria-label="Number of transactions per month"
                />
              )}
            </fieldset>

            <fieldset>
              <legend className={labelClass}>Channel</legend>
              <div className="mt-2 flex flex-wrap gap-4 text-small text-ink-soft">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="channel"
                    checked={channel === "card_not_present"}
                    onChange={() => {
                      setChannel("card_not_present");
                      setInterchangeRaw(String(DEFAULT_INTERCHANGE.card_not_present));
                    }}
                  />
                  Card not present (online)
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="channel"
                    checked={channel === "card_present"}
                    onChange={() => {
                      setChannel("card_present");
                      setInterchangeRaw(String(DEFAULT_INTERCHANGE.card_present));
                    }}
                  />
                  Card present (retail / swipe)
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend className={labelClass}>Current processor preset</legend>
              <div className="mt-2 flex flex-wrap gap-3 text-small text-ink-soft">
                {(
                  [
                    ["stripe", "Stripe"],
                    ["square", "Square"],
                    ["paypal", "PayPal"],
                    ["custom", "Custom flat rate"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="processor"
                      checked={processor === key}
                      onChange={() => setProcessor(key)}
                    />
                    {label}
                  </label>
                ))}
              </div>
              {processor !== "custom" ? (
                <p className="mt-2 text-caption text-muted">
                  Using {processorPresets[processor].rates[channel].label}.
                  Labeled ESTIMATE from a public fee schedule.
                </p>
              ) : (
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div>
                    <label htmlFor="customPercent" className="text-caption text-muted">
                      Rate %
                    </label>
                    <input
                      id="customPercent"
                      inputMode="decimal"
                      className={fieldClass}
                      value={customPercentRaw}
                      onChange={(e) => setCustomPercentRaw(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="customPerTxn" className="text-caption text-muted">
                      Per transaction ($)
                    </label>
                    <input
                      id="customPerTxn"
                      inputMode="decimal"
                      className={fieldClass}
                      value={customPerTxnRaw}
                      onChange={(e) => setCustomPerTxnRaw(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="customMonthly" className="text-caption text-muted">
                      Monthly fee ($)
                    </label>
                    <input
                      id="customMonthly"
                      inputMode="decimal"
                      className={fieldClass}
                      value={customMonthlyRaw}
                      onChange={(e) => setCustomMonthlyRaw(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </fieldset>

            <div>
              <label className="inline-flex items-center gap-2 text-small text-ink-soft">
                <input
                  type="checkbox"
                  checked={overrideEnabled}
                  onChange={(e) => setOverrideEnabled(e.target.checked)}
                />
                I know my effective rate % (overrides preset math)
              </label>
              {overrideEnabled ? (
                <input
                  id="effectiveRate"
                  inputMode="decimal"
                  className={fieldClass}
                  value={effectiveRateRaw}
                  onChange={(e) => setEffectiveRateRaw(e.target.value)}
                  placeholder="e.g. 3.1"
                  aria-label="Current effective rate percent"
                />
              ) : null}
            </div>

            {result && result.band !== "flatRate" ? (
              <div>
                <label htmlFor="interchange" className={labelClass}>
                  Assumed interchange % (for CDG IC+ illustration)
                </label>
                <input
                  id="interchange"
                  inputMode="decimal"
                  className={fieldClass}
                  value={interchangeRaw}
                  onChange={(e) => setInterchangeRaw(e.target.value)}
                />
                <p className="mt-1.5 text-caption text-muted">
                  Default {formatPercent(DEFAULT_INTERCHANGE[channel])} for this
                  channel. Interchange is assumed, not a quote. Change it to
                  match your card mix.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <Heading level={2} size="sm">
            Estimated monthly cost
          </Heading>
          {!result ? (
            <p className="mt-4 text-small text-ink-soft">
              Enter a positive monthly volume and average ticket (or transaction
              count) to see estimates.
            </p>
          ) : (
            <>
              <p className="mt-2 text-small text-ink-soft">
                About {result.transactions.toFixed(0)} transactions a month at{" "}
                {formatMoney(result.avgTicket)} average. Figures are illustrative
                estimates, not a quote and not a savings promise.
              </p>

              <CompareTable
                className="mt-6"
                caption="Side-by-side estimates. Confirm with a statement and a CDG quote."
                columns={[result.current.name, result.cdg.name]}
                rows={[
                  {
                    label: "Estimated monthly $",
                    values: [
                      formatMoney(result.current.monthlyCost),
                      formatMoney(result.cdg.monthlyCost),
                    ],
                  },
                  {
                    label: "Effective rate",
                    values: [
                      formatPercent(result.current.effectiveRate),
                      formatPercent(result.cdg.effectiveRate),
                    ],
                  },
                  {
                    label: "Schedule used",
                    values: [result.current.planLabel, result.cdg.planLabel],
                  },
                ]}
              />

              <div className="mt-6 space-y-4 text-small text-ink-soft">
                <div>
                  <p className="font-semibold text-ink">Current processor formula</p>
                  <p className="mt-1 font-mono text-caption text-muted">
                    {result.current.formula}
                  </p>
                  <p className="mt-1 text-caption text-muted">
                    {result.current.disclaimer}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-ink">CDG illustration formula</p>
                  <p className="mt-1 font-mono text-caption text-muted">
                    {result.cdg.formula}
                  </p>
                  <p className="mt-1 text-caption text-muted">{result.cdg.disclaimer}</p>
                </div>
              </div>

              {result.band === "flatRate" ? (
                <p className="mt-4 text-small text-ink-soft">
                  At under $10K a month, CDG&apos;s published Flat Rate plan is
                  the band shown ({flatPlan.band}).
                </p>
              ) : null}
              {result.band === "interchangePlus" ? (
                <p className="mt-4 text-small text-ink-soft">
                  At {icPlan.bandShort.toLowerCase()}, CDG publishes Interchange
                  Plus markups. The CDG column adds an assumed interchange to that
                  markup so you can see an illustrative total.
                </p>
              ) : null}
              {result.wholesaleNote ? (
                <p className="mt-4 text-small text-ink-soft">
                  At {wholesalePlan.bandShort.toLowerCase()}, CDG also offers{" "}
                  <Link
                    href="/cdgcommerce#pricing"
                    className="text-action underline-offset-4 hover:underline"
                  >
                    Wholesale Membership
                  </Link>{" "}
                  (interchange at cost plus a flat per-transaction fee and an
                  annual membership). The table still shows an Interchange Plus
                  illustration for comparison. Ask CDG which band fits.
                </p>
              ) : null}

              <SourceNote
                source={cdgSources.pricing}
                checked={CDG_CHECKED}
                className="mt-6"
                note="CDG Flat Rate and Interchange Plus figures are copied from CDG's pricing pages."
              />
              {presetSource && presetNote ? (
                <SourceNote
                  source={presetSource}
                  checked={PROCESSOR_FEES_CHECKED}
                  className="mt-2"
                  note={presetNote}
                />
              ) : (
                <p className="mt-2 text-caption text-muted">
                  Custom schedule uses the percentage, per-transaction, and
                  monthly fee you entered.
                </p>
              )}

              <DecisionCard
                title="Want numbers for your own volume?"
                className="mt-8"
                actions={
                  <>
                    <CtaButton cta="quote" position="after_pricing" />
                    <CtaButton
                      cta="compare"
                      position="after_pricing"
                      variant="secondary"
                    />
                  </>
                }
                note="A quote request ends in a phone call and a rate sheet. This calculator is not a quote."
              >
                CDG prices each merchant after underwriting. Use the estimate
                above as a starting point, then compare the published plan pages
                or request a quote.
              </DecisionCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
