import * as fs from 'fs';
import * as path from 'path';

function getNestedEntries(
  obj: Record<string, unknown>,
  prefix = ''
): Array<{ key: string; value: unknown }> {
  let entries: Array<{ key: string; value: unknown }> = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      entries = entries.concat(getNestedEntries(val as Record<string, unknown>, fullKey));
    } else {
      entries.push({ key: fullKey, value: val });
    }
  }
  return entries;
}

function extractPlaceholders(text: string): string[] {
  const matches = text.match(/\{([a-zA-Z0-9_]+)\}/g);
  if (!matches) return [];
  return Array.from(new Set(matches.map((m) => m.slice(1, -1)))).sort();
}

function checkI18n() {
  const enPath = path.join(process.cwd(), 'src/messages/en.json');
  const hiPath = path.join(process.cwd(), 'src/messages/hi.json');

  if (!fs.existsSync(enPath) || !fs.existsSync(hiPath)) {
    console.error('❌ Error: Translation files not found in src/messages/');
    process.exit(1);
  }

  const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const hi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

  const enEntries = getNestedEntries(en);
  const hiEntries = getNestedEntries(hi);

  const enMap = new Map(enEntries.map((e) => [e.key, e.value]));
  const hiMap = new Map(hiEntries.map((e) => [e.key, e.value]));

  const enKeys = new Set(enMap.keys());
  const hiKeys = new Set(hiMap.keys());

  const missingInHi = [...enKeys].filter((k) => !hiKeys.has(k));
  const missingInEn = [...hiKeys].filter((k) => !enKeys.has(k));

  let hasErrors = false;

  // 1. Check Missing Keys
  if (missingInHi.length > 0) {
    console.error(`❌ Missing keys in Hindi (hi.json) (${missingInHi.length}):`);
    missingInHi.forEach((k) => console.error(`  - ${k}`));
    hasErrors = true;
  }

  if (missingInEn.length > 0) {
    console.error(`❌ Missing keys in English (en.json) (${missingInEn.length}):`);
    missingInEn.forEach((k) => console.error(`  - ${k}`));
    hasErrors = true;
  }

  // 2. Check Empty Translations & Type Mismatches
  const emptyTranslations: string[] = [];
  const placeholderMismatches: string[] = [];

  for (const key of enKeys) {
    if (!hiKeys.has(key)) continue;

    const enVal = enMap.get(key);
    const hiVal = hiMap.get(key);

    if (typeof enVal === 'string') {
      if (enVal.trim() === '') {
        emptyTranslations.push(`English key "${key}" is empty`);
      }
      if (typeof hiVal === 'string') {
        if (hiVal.trim() === '') {
          emptyTranslations.push(`Hindi key "${key}" is empty`);
        } else {
          // Check placeholder parity
          const enVars = extractPlaceholders(enVal);
          const hiVars = extractPlaceholders(hiVal);
          if (JSON.stringify(enVars) !== JSON.stringify(hiVars)) {
            placeholderMismatches.push(
              `Key "${key}": placeholders mismatch. EN: [${enVars.join(', ')}] vs HI: [${hiVars.join(', ')}]`
            );
          }
        }
      } else {
        emptyTranslations.push(`Type mismatch for "${key}": EN is string, HI is ${typeof hiVal}`);
      }
    }
  }

  if (emptyTranslations.length > 0) {
    console.error(`\n❌ Empty or Invalid Translations (${emptyTranslations.length}):`);
    emptyTranslations.forEach((err) => console.error(`  - ${err}`));
    hasErrors = true;
  }

  if (placeholderMismatches.length > 0) {
    console.error(`\n❌ Placeholder Mismatches (${placeholderMismatches.length}):`);
    placeholderMismatches.forEach((err) => console.error(`  - ${err}`));
    hasErrors = true;
  }

  if (hasErrors) {
    console.error('\n🚨 i18n Guardrail Failed: Translation keys, values, and placeholders must match 1:1 between English and Hindi.');
    process.exit(1);
  } else {
    console.log(
      `✅ i18n Guardrail Passed: All ${enKeys.size} translation keys, values, and interpolation variables match between en.json and hi.json.`
    );
  }
}

checkI18n();
