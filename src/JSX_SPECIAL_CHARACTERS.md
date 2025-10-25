# 🔤 JSX Special Characters Guide

## Quick Reference

### The Problem

```tsx
// ❌ WRONG - Will cause build error
<p>Price is >100</p>
<p>Value < 50</p>
<p>Company & Co</p>
```

### The Solution

```tsx
// ✅ CORRECT - Use HTML entities
<p>Price is >100</p>
<p>Value < 50</p>
<p>Company & Co</p>
```

---

## HTML Entity Table

| Character | Entity | Name | Example |
|-----------|--------|------|---------|
| `<` | `<` | Less Than | `x < 5` → x < 5 |
| `>` | `>` | Greater Than | `x > 5` → x > 5 |
| `&` | `&` | Ampersand | `You & Me` → You & Me |
| `"` | `&quot;` | Double Quote | `Say &quot;Hi&quot;` → Say "Hi" |
| `'` | `&apos;` | Apostrophe | `It&apos;s` → It's |
| ` ` | `&nbsp;` | Non-breaking Space | `Word&nbsp;Word` → Word Word |

---

## Common Use Cases

### 1. Comparisons

```tsx
// ❌ WRONG
<Badge>Overdue (>30 days)</Badge>
<Badge>Less than (<10)</Badge>

// ✅ CORRECT
<Badge>Overdue (>30 days)</Badge>
<Badge>Less than (<10)</Badge>
```

### 2. Company Names

```tsx
// ❌ WRONG
<h1>Smith & Jones Ltd.</h1>

// ✅ CORRECT
<h1>Smith & Jones Ltd.</h1>
```

### 3. Code Examples

```tsx
// ❌ WRONG
<code><div>Hello</div></code>

// ✅ CORRECT
<code><div>Hello</div></code>
```

### 4. Math Expressions

```tsx
// ❌ WRONG
<p>If x > y and y < z</p>

// ✅ CORRECT
<p>If x > y and y < z</p>
```

---

## When You DON'T Need Entities

### 1. Inside JavaScript Expressions

```tsx
// ✅ NO ENTITIES NEEDED
{count > 5 ? "Many" : "Few"}
{price < 100 && <Badge>Cheap</Badge>}
{name && <p>{name}</p>}
```

### 2. In Attributes

```tsx
// ✅ NO ENTITIES NEEDED
<div className="text-xl">
<input type="text" />
<img src="path/to/image.png" />
```

### 3. In JavaScript Strings

```tsx
// ✅ NO ENTITIES NEEDED
const message = "Value > 100";
const condition = price < 50;
const company = "Smith & Jones";
```

### 4. In Comments

```tsx
// ✅ NO ENTITIES NEEDED
{/* This is > 5 and < 10 */}
// Comment with > and < symbols
```

---

## Real-World Examples from FNG App

### Example 1: Severity Badges

```tsx
// ❌ WRONG - Build Error!
<Card>
  <p className="text-xs">Mild (≤1 week)</p>
  <p className="text-xs">Moderate (2-4 weeks)</p>
  <p className="text-xs">Severe (>4 weeks)</p>
</Card>

// ✅ CORRECT
<Card>
  <p className="text-xs">Mild (≤1 week)</p>
  <p className="text-xs">Moderate (2-4 weeks)</p>
  <p className="text-xs">Severe (>4 weeks)</p>
</Card>
```

### Example 2: Loan Amounts

```tsx
// ❌ WRONG
<p>Loan amount < ₦50,000</p>

// ✅ CORRECT
<p>Loan amount < ₦50,000</p>
```

### Example 3: Company Name

```tsx
// ❌ WRONG
<h1>FNG Financial Services & Loans</h1>

// ✅ CORRECT
<h1>FNG Financial Services & Loans</h1>
```

---

## Quick Decision Tree

```
Is the character inside JSX content?
├─ YES
│  ├─ Is it <, >, &, ", or '?
│  │  ├─ YES → Use HTML entity
│  │  └─ NO → Use as is
│  └─
└─ NO (it's in JavaScript, attributes, or comments)
   └─ Use as is (no entity needed)
```

---

## Common Mistakes

### Mistake 1: Forgetting to Escape

```tsx
// ❌ Error: ">" is not valid inside JSX element
<Badge>Days overdue (>30)</Badge>

// ✅ Fixed
<Badge>Days overdue (>30)</Badge>
```

### Mistake 2: Escaping JavaScript Expressions

```tsx
// ❌ WRONG - Don't escape inside {}
{count > 5 ? "Yes" : "No"}

// ✅ CORRECT
{count > 5 ? "Yes" : "No"}
```

### Mistake 3: Double Escaping

```tsx
// ❌ WRONG - This will display as "&gt;"
<p>&gt;5</p>

// ✅ CORRECT - Escape once
<p>>5</p>
```

---

## Browser Rendering

HTML entities are automatically converted by the browser:

```tsx
// Your Code:
<p>Price is > ₦100</p>

// Browser Shows:
Price is > ₦100
```

Users never see `>` - they see the actual `>` character!

---

## Search & Replace Guide

If you have existing code with unescaped characters:

### Find:
```
>([0-9])
```

### Replace:
```
>$1
```

This works in most code editors with regex search enabled.

---

## VSCode Snippet

Create a snippet to remember entities:

```json
{
  "HTML Greater Than": {
    "prefix": "gt",
    "body": ">",
    "description": "HTML greater than entity"
  },
  "HTML Less Than": {
    "prefix": "lt",
    "body": "<",
    "description": "HTML less than entity"
  },
  "HTML Ampersand": {
    "prefix": "amp",
    "body": "&",
    "description": "HTML ampersand entity"
  }
}
```

---

## Testing Your Code

### Manual Check

Look for these patterns in JSX content:
- `>` followed by numbers: `>30`
- `<` followed by numbers: `<10`
- `&` in company names: `Smith & Co`
- Single `>` or `<` in text

### Regex Search

Search your codebase for:
```regex
<[^{/>]*>[^<]*[<>&][^<]*<
```

This finds potential unescaped characters in JSX.

---

## Prevention Tips

1. **Always escape comparisons** in text content
2. **Use JavaScript expressions** when possible: `{count > 5 && ...}`
3. **Remember: Inside {} = JavaScript, Outside {} = HTML**
4. **Test build locally** before deploying
5. **Use linters** to catch JSX syntax errors early

---

## Error Messages to Watch For

If you see these errors, check for unescaped characters:

```
❌ "The character ">" is not valid inside a JSX element"
❌ "Adjacent JSX elements must be wrapped in an enclosing tag"
❌ "Unexpected token <"
❌ "Expected corresponding JSX closing tag"
```

These often indicate unescaped `<` or `>` characters.

---

## Summary

✅ **Use entities for:** `<`, `>`, `&`, `"`, `'` in JSX text content  
✅ **Don't use entities for:** JavaScript expressions, attributes, comments  
✅ **Remember:** Browser automatically converts entities to symbols  
✅ **Test:** Build locally to catch errors early  

**Keep this guide handy when writing JSX!** 📚
