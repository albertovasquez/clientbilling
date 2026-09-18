import { Button, Container, Heading, Section } from "@/components/ui";

export default function NotFound() {
  return (
    <Section>
      <Container width="article">
        <Heading level={1}>Page not found</Heading>
        <p className="mt-4 text-body text-ink-soft">
          The address you followed does not match a page on ClientBilling.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/">Go to the homepage</Button>
          <Button href="/blog" variant="secondary">
            Browse the guides
          </Button>
        </div>
      </Container>
    </Section>
  );
}
