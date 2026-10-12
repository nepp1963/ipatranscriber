import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const VOWELS: [string, string][] = [
  ["iː / i", "see"], ["ɪ", "sit"], ["e / ɛ", "bed"], ["æ", "cat"], ["ɑː / ɑ", "father"], ["ɒ", "hot (UK)"],
  ["ɔː / ɔ", "law"], ["ʊ", "put"], ["uː / u", "blue"], ["ʌ", "cup"], ["ɜː / ɝ", "bird"], ["ə", "about"],
  ["ɚ", "butter (US)"], ["eɪ", "day"], ["aɪ", "my"], ["ɔɪ", "boy"], ["əʊ / oʊ", "go"], ["aʊ", "now"],
  ["ɪə", "near (UK)"], ["eə", "hair (UK)"], ["ʊə", "pure (UK)"],
];
const CONSONANTS: [string, string][] = [
  ["p", "pen"], ["b", "bad"], ["t", "tea"], ["d", "did"], ["k", "cat"], ["ɡ", "get"], ["tʃ", "chin"], ["dʒ", "June"],
  ["f", "fall"], ["v", "van"], ["θ", "thin"], ["ð", "this"], ["s", "see"], ["z", "zoo"], ["ʃ", "shoe"], ["ʒ", "vision"],
  ["h", "hat"], ["m", "man"], ["n", "no"], ["ŋ", "sing"], ["l", "leg"], ["r", "red"], ["j", "yes"], ["w", "wet"],
];
const STRESS: [string, string][] = [
  ["ˈ", "Primary stress — placed before the stressed syllable: /ˈwɔːtə/"],
  ["ˌ", "Secondary stress: /ˌedʒʊˈkeɪʃən/"],
  [".", "Syllable break: /ˈwɔː.tə/"],
  ["ː", "Long vowel: /siː/"],
];

function Grid({ items }: { items: [string, string][] }) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {items.map(([s, ex]) => (
        <li key={s} className="flex items-center gap-3 rounded-xl border bg-card p-2.5">
          <span className="font-ipa min-w-14 text-center text-xl text-primary">{s}</span>
          <span className="text-sm text-muted-foreground">{ex}</span>
        </li>
      ))}
    </ul>
  );
}

export function Legend() {
  return (
    <Accordion type="multiple" className="rounded-2xl border bg-card px-5 shadow-soft">
      <AccordionItem value="v"><AccordionTrigger>Vowels &amp; diphthongs</AccordionTrigger><AccordionContent><Grid items={VOWELS} /><p className="mt-3 text-xs text-muted-foreground">Where two symbols appear, the first is British (RP), the second American (GA).</p></AccordionContent></AccordionItem>
      <AccordionItem value="c"><AccordionTrigger>Consonants</AccordionTrigger><AccordionContent><Grid items={CONSONANTS} /></AccordionContent></AccordionItem>
      <AccordionItem value="s" className="border-b-0">
        <AccordionTrigger>Stress &amp; other symbols</AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-2">
            {STRESS.map(([s, d]) => (
              <li key={s} className="flex items-center gap-3"><span className="font-ipa w-10 rounded-lg bg-secondary py-1 text-center text-xl text-secondary-foreground">{s}</span><span className="text-sm">{d}</span></li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
