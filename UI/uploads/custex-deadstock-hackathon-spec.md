# ReFleek Hackathon Product Spec

## Product Name

**ReFleek**

## One-Line Positioning

An AI node-based workflow that turns deadstock fabric and unresellable secondhand garments into manufacturable products.

## Short Pitch

ReFleek helps users create new products from circular material resources.

Users choose what they want to make, select a material source, choose techniques, create patterns, arrange layouts, render the product, and send a tech pack to a production partner.

The material resource pool has two sources:

1. **New deadstock fabric** from factories, mills, brands, and suppliers.
2. **Reclaimed secondhand fabric** from Fleek's India and Pakistan sorting centres, where unresellable garments can be deconstructed and reused as material.

This turns both unused fabric rolls and unsellable secondhand garments into inputs for new small-batch production.

## Hackathon Track Fit

Primary track: **Circular Moonshot**

Secondary track: **Agents & LLMs**

Why:

- It pushes circular fashion beyond resale by creating a new use for surplus fabric and unresellable garments.
- It uses AI to guide users through material selection, design decisions, layout, rendering, and production brief generation.
- It connects Fleek's secondhand supply chain with a new circular production workflow.

## Core Idea

Fleek already helps move secondhand fashion through global resale channels. But not every garment can be resold.

Some garments are too damaged, too low-value, outdated, or inconsistent to be sold as clothing. However, the fabric itself may still be useful.

ReFleek adds a new layer:

```text
Fleek secondhand supply
→ identify unresellable garments
→ deconstruct into reusable material
→ add to material resource pool
→ let users design new products
→ generate tech packs for local production partners
```

At the same time, ReFleek can also use new deadstock fabric from factories and suppliers:

```text
Factory deadstock fabric
→ material resource pool
→ user product workflow
→ AI design and production planning
→ maker / factory tech pack
```

## Product Thesis

Most AI design tools start with a blank canvas.

ReFleek starts with real material constraints:

- What the user wants to make
- What circular materials are available
- Whether the material is new deadstock or reclaimed secondhand fabric
- What production partners can actually make

This makes the creative output more realistic, manufacturable, and circular.

## Relationship to Custex AI

ReFleek uses the same product logic as Custex AI:

```text
Choose product
→ Choose material and technique
→ Choose pattern
→ Choose layout
→ Render
→ Send tech pack to producer
```

The difference is that ReFleek's material system is circular by default.

Users do not start from generic blank materials. They create from:

- Deadstock fabric rolls
- Reclaimed fabric panels
- Deconstructed secondhand garments
- Mixed material lots from Fleek-linked sorting centres

## Material Sources

## Source 1: New Deadstock Fabric

Unused fabric from factories, mills, brands, and suppliers.

Examples:

- Overordered cotton jersey
- Cancelled production linen
- Surplus canvas
- Leftover uniform fabric
- Deadstock twill
- Unused printed fabric

Best for:

- Tablecloths
- Tote bags
- Aprons
- Scarves
- Cushion covers
- T-shirts
- Small-batch apparel
- Event textiles

## Source 2: Reclaimed Secondhand Fabric

Fabric recovered from garments that cannot be resold as clothing.

These garments may come from Fleek's India and Pakistan sorting centres, where large volumes of secondhand clothes already move through the supply chain.

Examples:

- Denim panels from damaged jeans or jackets
- Cotton jersey from unsellable T-shirts
- Knit panels from damaged sweaters
- Canvas from workwear
- Shirting fabric from flawed shirts
- Mixed patchwork material from low-resale garments

Best for:

- Patchwork products
- Tote bags
- Quilted accessories
- Upcycled jackets
- Cushion covers
- Applique panels
- Small accessories
- Limited one-of-one drops

## Why India and Pakistan Production Partners

For this hackathon version, ReFleek only uses production partners connected to Fleek's India and Pakistan sorting centres.

Reasoning:

- Large volumes of secondhand garments already flow into India and Pakistan.
- Fleek already has operational relevance in these regions.
- Deconstruction, sorting, repair, cutting, stitching, and small-batch production can happen closer to where the material is processed.
- This reduces unnecessary back-and-forth movement of low-value material.
- It creates work opportunities for local makers, sewing units, embroidery studios, and micro-factories.

The production layer should be framed as:

```text
Fleek India / Pakistan sorting centres
→ material recovery
→ local production partner
→ finished small-batch product
```

## Target Users

### Demand Side

- Independent designers
- Small fashion brands
- Event merch teams
- Restaurants and hotels making textiles
- Creators launching small drops
- Fashion students
- Upcycling studios
- Etsy / Shopify sellers
- Local boutiques

### Supply Side

- Fleek-linked sorting centres
- Used clothing suppliers
- Factories with deadstock fabric
- Fabric warehouses
- Small sewing units
- Embroidery studios
- Print shops
- Micro-factories in India and Pakistan

## Core User Flow

ReFleek is a node workflow, not a simple chatbot.

```text
1. Product Node
2. Material Node
3. Technique Node
4. Pattern Node
5. Layout Node
6. Render Node
7. Tech Pack Node
8. Producer Node
```

## Node 1: Product

The user chooses what they want to make.

Examples:

- Tablecloth
- Tote bag
- Apron
- Scarf
- Cushion cover
- T-shirt
- Patchwork jacket
- Quilted vest
- Upcycled accessory
- Custom item

Prompt:

```text
What do you want to make?
```

Example user input:

```text
I want to make 15 minimal tablecloths for a restaurant using circular materials.
```

## Node 2: Material

The user chooses a material source.

Options:

- New deadstock fabric
- Reclaimed secondhand fabric
- Mix both
- AI recommendation

Material cards should show:

- Source type
- Available quantity
- Width or panel dimensions
- Color
- Texture
- Material guess
- Best use
- Region
- Supplier / centre
- Circular impact note

Example material options:

### New Deadstock: Natural Linen Blend

```text
Source: Factory deadstock
Available: 42m
Width: 150cm
Color: Natural beige
Location: Pakistan supplier
Best for: Tablecloths, napkins, aprons, cushion covers
```

### Reclaimed: Denim Panel Lot

```text
Source: Deconstructed secondhand garments
Available: 120 usable panels
Average panel size: 45cm x 60cm
Color: Mixed indigo tones
Location: Fleek-linked sorting centre, Pakistan
Best for: Patchwork totes, cushions, jackets, applique
```

### Reclaimed: Cotton Jersey Bundle

```text
Source: Unresellable T-shirts
Available: 35kg sorted cotton jersey
Color: Off-white and light grey
Location: Fleek-linked sorting centre, India
Best for: Patchwork tops, stuffing, trims, small accessories
```

## Node 3: Technique

The user chooses or receives AI recommendations for production techniques.

Options:

- Cut and sew
- Embroidery
- Print
- Patchwork
- Applique
- Quilting
- Edge finishing
- Visible mending
- Mixed media

AI should recommend techniques based on:

- Product type
- Material source
- Material size
- Fabric condition
- Budget
- Production feasibility

Example:

```text
If material = reclaimed denim panels
and product = tote bag
→ recommend patchwork + reinforced stitching
→ avoid all-over print because panels vary in shade
```

## Node 4: Pattern

The user chooses or generates the visual pattern.

Pattern options:

- No pattern
- Minimal logo
- All-over print
- Placement print
- Embroidery motif
- Patchwork composition
- Applique motif
- AI-generated pattern

AI should generate patterns that respect the selected material and technique.

Example:

```text
For reclaimed denim panels, generate a modular patchwork layout instead of a precise all-over print.
```

## Node 5: Layout

The user arranges the design on the product.

Layout options:

- Front placement
- Back placement
- Corner placement
- Repeat layout
- Patchwork grid
- Randomized panel layout
- Border layout
- Pocket placement

For reclaimed fabric, layout is especially important because material pieces may have different sizes, shades, and visible history.

## Node 6: Render

The app generates a visual preview.

Render should show:

- Product mockup
- Selected material
- Pattern / embroidery / patchwork placement
- Color and texture direction
- Circular material label

For the hackathon MVP, the render can be semi-realistic. It does not need perfect textile simulation.

## Node 7: Tech Pack

The app generates a production-ready tech pack.

The tech pack should include:

- Product type
- Quantity
- Selected material
- Material source
- Material dimensions
- Cutting notes
- Construction notes
- Technique notes
- Pattern or layout notes
- Print / embroidery notes
- Quality control notes
- Estimated cost
- Estimated production time
- Suggested producer type

## Node 8: Producer

The app recommends a production partner from the India / Pakistan production pool.

Producer types:

- Sewing unit
- Embroidery studio
- Print shop
- Patchwork maker
- Quilting unit
- Upcycling studio
- Micro-factory

The hackathon demo can use mock producer cards.

Example:

```text
Producer: Karachi Patchwork Studio
Location: Karachi, Pakistan
Capabilities: Denim patchwork, bags, jackets, embroidery
Best for: Reclaimed denim panel products
Lead time: 7-10 days
Minimum order: 10 pieces
```

## AI Brief Builder

The AI should help the user move through the nodes. It should ask focused questions and convert answers into structured product decisions.

Key questions:

1. What do you want to make?
2. How many pieces do you need?
3. Do you prefer new deadstock, reclaimed secondhand fabric, or either?
4. What style direction do you want?
5. What techniques are acceptable?
6. What is your budget?
7. Should production happen through Fleek's India / Pakistan partner network?

## Example Demo Flow

Use one main demo scenario.

### Demo Scenario

User says:

```text
I want to make 20 tote bags for a vintage market using circular materials. I want them to feel one-of-one, but still easy to produce.
```

### Step 1: AI Follow-Up

AI asks:

```text
Do you prefer new deadstock fabric, reclaimed secondhand fabric, or a mix?
```

User selects:

```text
Reclaimed secondhand fabric
```

AI asks:

```text
Should the design feel minimal, patchwork, workwear, or playful?
```

User selects:

```text
Workwear patchwork
```

### Step 2: Material Recommendation

AI recommends:

```text
Reclaimed denim panel lot
Source: Deconstructed unresellable jeans and jackets
Location: Fleek-linked sorting centre, Pakistan
Available: 120 usable panels
Best for: Patchwork totes and accessories
```

### Step 3: Technique Recommendation

AI recommends:

```text
Technique: Patchwork + reinforced stitching + optional embroidery label
Reason: Denim panels vary in shade and size, so patchwork turns inconsistency into a design feature.
Avoid: All-over print, because panel color variation may make printing inconsistent.
```

### Step 4: Pattern and Layout

AI generates:

```text
Pattern: Modular workwear patchwork
Layout: 4-panel front, 4-panel back, reinforced handle tabs
Optional motif: Small embroidered ReFleek mark on front pocket
```

### Step 5: Render

The app renders a patchwork tote preview.

### Step 6: Tech Pack

The app creates:

```text
Product: Patchwork tote bag
Quantity: 20
Material: Reclaimed denim panels
Source: Fleek-linked Pakistan sorting centre
Technique: Patchwork cut-and-sew with reinforced stitching
Trim: Reclaimed cotton webbing or deadstock canvas handles
Producer: Karachi Patchwork Studio
Estimated lead time: 7-10 days
```

## Secondary Demo Scenario

Use this if you want to show new deadstock fabric too.

User says:

```text
I want to make 15 minimal tablecloths for a restaurant using circular materials. Budget under £300.
```

AI recommends:

```text
Material: New deadstock linen blend
Source: Pakistan fabric supplier
Technique: Cut and sew + optional tonal embroidery
Layout: Bottom-right logo embroidery
Producer: Lahore Home Textile Unit
```

This demonstrates that ReFleek supports both new deadstock and reclaimed secondhand materials.

## Mock Material Resource Pool

For the hackathon MVP, use mock inventory.

### Material 1: New Deadstock Linen Blend

```text
Type: New deadstock fabric
Available: 42m
Width: 150cm
Color: Natural beige
Location: Pakistan
Best for: Tablecloths, napkins, aprons, cushion covers
```

### Material 2: New Deadstock Cotton Twill

```text
Type: New deadstock fabric
Available: 60m
Width: 160cm
Color: Charcoal
Location: India
Best for: Aprons, tote bags, workwear panels, cushion covers
```

### Material 3: Reclaimed Denim Panel Lot

```text
Type: Reclaimed secondhand fabric
Source: Deconstructed unresellable jeans and jackets
Available: 120 panels
Average size: 45cm x 60cm
Color: Mixed indigo
Location: Fleek-linked sorting centre, Pakistan
Best for: Patchwork totes, cushions, jackets, applique
```

### Material 4: Reclaimed Shirt Cotton Bundle

```text
Type: Reclaimed secondhand fabric
Source: Deconstructed flawed shirts
Available: 80 panels
Average size: 40cm x 55cm
Color: Blue and white stripes
Location: Fleek-linked sorting centre, India
Best for: Patchwork shirts, linings, scarves, accessories
```

### Material 5: Reclaimed Knit Bundle

```text
Type: Reclaimed secondhand fabric
Source: Damaged sweaters and knitwear
Available: 25kg sorted knit panels
Color: Mixed neutrals
Location: Fleek-linked sorting centre, Pakistan
Best for: Patchwork cushions, soft accessories, appliques
```

## Mock Producer Pool

### Producer 1: Karachi Patchwork Studio

```text
Location: Karachi, Pakistan
Capabilities: Patchwork, denim products, tote bags, small accessories
Best for: Reclaimed denim and mixed panel products
MOQ: 10 pieces
Lead time: 7-10 days
```

### Producer 2: Lahore Home Textile Unit

```text
Location: Lahore, Pakistan
Capabilities: Tablecloths, aprons, napkins, edge finishing, embroidery
Best for: Deadstock linen, cotton twill, hospitality textiles
MOQ: 15 pieces
Lead time: 5-8 days
```

### Producer 3: Delhi Embroidery Workshop

```text
Location: Delhi, India
Capabilities: Embroidery, applique, logo placement, small-batch garment finishing
Best for: Tote bags, aprons, patches, embellishment
MOQ: 20 pieces
Lead time: 6-9 days
```

## Page Structure

## Page 1: Product Node

Main prompt:

```text
What do you want to make?
```

Example placeholder:

```text
20 patchwork tote bags for a vintage market using circular materials.
```

CTA:

```text
Start workflow
```

## Page 2: Material Node

Show material source choice:

- New deadstock fabric
- Reclaimed secondhand fabric
- Mix both
- Let AI recommend

Then show recommended material cards.

## Page 3: Technique Node

Show AI-recommended techniques based on selected material.

Examples:

- Patchwork
- Cut and sew
- Embroidery
- Print
- Applique
- Quilting

## Page 4: Pattern Node

Let the user choose:

- No pattern
- Placement print
- Embroidery motif
- Patchwork composition
- AI-generated pattern

## Page 5: Layout Node

Let the user choose:

- Center placement
- Corner placement
- Repeat
- Patchwork grid
- Border
- Randomized panel layout

## Page 6: Render Node

Show product preview with selected material, technique, pattern, and layout.

## Page 7: Tech Pack Node

Show production-ready output.

Include:

- Product summary
- Material source
- Material quantity
- Pattern and layout
- Construction notes
- Technique notes
- Producer recommendation
- Estimated lead time
- Estimated cost range
- Circular impact

## Page 8: Producer Node

Show India / Pakistan production partner recommendation.

Each producer card includes:

- Name
- Location
- Capabilities
- MOQ
- Lead time
- Why matched

## Impact Output

Show simple circular impact metrics.

Example:

```text
Material source: Reclaimed secondhand denim
Unresellable garments reused: 35 jeans / jackets
Usable panels recovered: 120
Products created: 20 tote bags
New fabric avoided: 18m equivalent
Production region: Pakistan
```

For deadstock:

```text
Material source: New deadstock linen blend
Deadstock fabric used: 38m
Products created: 15 tablecloths
Leftover fabric: 4m
Suggested leftover use: napkins or coasters
```

## MVP Scope

### Must Have

- Node-based workflow
- Product selection
- Material source selection
- Mock material resource pool
- AI material recommendation
- Technique recommendation
- Pattern and layout selection
- Render preview
- Tech pack output
- Mock India / Pakistan producer recommendation

### Nice to Have

- Conversational AI brief builder
- Material upload path
- Better visual render
- PDF export
- Impact metrics
- Multiple demo scenarios

### Do Not Build

- Real Fleek API integration
- Real supplier marketplace
- Real payment
- Real logistics
- Real inventory sync
- Full CAD pattern making
- Real factory ordering
- Complex user accounts

## Visual Direction

The interface should feel close to Custex AI:

- Node-based creative workflow
- Material-first design
- Product configuration
- Render-first output
- Production handoff

Visual mood:

- Fashion tech
- Circular production
- Clean but tactile
- Material swatches
- Product previews
- Workflow nodes
- Professional enough for manufacturers
- Creative enough for designers

Avoid:

- Generic chatbot UI only
- Charity-style sustainability branding
- Pure fabric ecommerce catalogue
- Pure AI image generator

## Key Copy

### Hero

Turn circular materials into new products.

### Subtitle

Choose a product, select deadstock or reclaimed secondhand materials, design the surface, render the result, and generate a tech pack for production partners.

### Problem

Deadstock fabric and unresellable secondhand garments hold material value, but they are disconnected from designers, makers, and small-batch production.

### Solution

ReFleek turns unused and unresellable material into a structured design-to-production workflow.

### Pitch Line

From leftover material to manufacturable product.

## Final Pitch

ReFleek is a circular design-to-production workflow built for Fleek's secondhand ecosystem. It lets users create products from two material sources: new deadstock fabric and reclaimed fabric from unresellable secondhand garments. Users choose a product, material, technique, pattern, and layout, then render the result and generate a tech pack for India and Pakistan production partners connected to Fleek's sorting supply chain. ReFleek turns material that would otherwise sit unused or fail resale into manufacturable small-batch products.

