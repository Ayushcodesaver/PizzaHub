CREATE TABLE public.menu_items (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  prices int[] NOT NULL DEFAULT ARRAY[]::int[],
  note text,
  featured boolean NOT NULL DEFAULT false,
  available boolean NOT NULL DEFAULT true,
  sort int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads menu" ON public.menu_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage menu" ON public.menu_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.offers (
  id text PRIMARY KEY,
  kind text NOT NULL DEFAULT 'combo',
  title text NOT NULL,
  price int,
  items text[] NOT NULL DEFAULT ARRAY[]::text[],
  text text,
  active boolean NOT NULL DEFAULT true,
  sort int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.offers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.offers TO authenticated;
GRANT ALL ON public.offers TO service_role;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads offers" ON public.offers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage offers" ON public.offers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.site_settings (
  id int PRIMARY KEY DEFAULT 1,
  party_package_price int NOT NULL DEFAULT 1500,
  party_hourly_rate int NOT NULL DEFAULT 400,
  party_three_hour_rate int NOT NULL DEFAULT 1000,
  party_package_items text[] NOT NULL DEFAULT ARRAY[]::text[]
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  customer_name text,
  phone text,
  address text,
  location text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_settings (id, party_package_items) VALUES (1, ARRAY['One large pizza','One sandwich','One burger','One plate of pasta','One cold coffee','One plate of fries','One stick garlic bread']::text[]);

INSERT INTO public.menu_items (id,name,category,prices,note,featured,available,sort) VALUES
('pizza-maniya-four-season','Four Season','pizza-maniya',ARRAY[200,350,500]::int[],NULL,true,true,0),
('pizza-maniya-paneer-bite','Paneer Bite','pizza-maniya',ARRAY[200,350,500]::int[],NULL,false,true,1),
('pizza-maniya-spicy-lover','Spicy Lover','pizza-maniya',ARRAY[200,350,500]::int[],NULL,false,true,2),
('pizza-maniya-all-toppings','All Toppings','pizza-maniya',ARRAY[200,350,500]::int[],NULL,false,true,3),
('pizza-maniya-8-flavoured-in-one-pizza','8 Flavoured in One Pizza','pizza-maniya',ARRAY[650]::int[],'Separate sauce charged extra',false,true,4),
('classic-veg-country-feast','Country Feast','classic-veg',ARRAY[150,300,380]::int[],NULL,false,true,5),
('classic-veg-farm-house','Farm House','classic-veg',ARRAY[150,300,380]::int[],NULL,true,true,6),
('classic-veg-tandoori-paneer','Tandoori Paneer','classic-veg',ARRAY[150,300,380]::int[],NULL,true,true,7),
('classic-veg-zesty-special','Zesty Special','classic-veg',ARRAY[150,300,380]::int[],NULL,false,true,8),
('classic-veg-tandoori-chilli','Tandoori Chilli','classic-veg',ARRAY[150,300,380]::int[],NULL,false,true,9),
('simply-veg-cheese-capsicum','Cheese Capsicum','simply-veg',ARRAY[100,180,280]::int[],NULL,false,true,10),
('simply-veg-cheese-corn','Cheese Corn','simply-veg',ARRAY[100,180,280]::int[],NULL,true,true,11),
('simply-veg-cheese-onion','Cheese Onion','simply-veg',ARRAY[100,180,280]::int[],NULL,false,true,12),
('simply-veg-cheese-tomato','Cheese Tomato','simply-veg',ARRAY[100,180,280]::int[],NULL,false,true,13),
('special-veg-cheese-black-olive','Cheese Black Olive','special-veg',ARRAY[130,230,330]::int[],NULL,false,true,14),
('special-veg-cheese-paneer','Cheese Paneer','special-veg',ARRAY[130,230,330]::int[],NULL,false,true,15),
('special-veg-cheese-mushroom','Cheese Mushroom','special-veg',ARRAY[130,230,330]::int[],NULL,false,true,16),
('kullad-tandoori-kullad-pizza','Tandoori Kullad Pizza','kullad',ARRAY[130]::int[],NULL,false,true,17),
('kullad-all-topping-kullad-pizza','All Topping Kullad Pizza','kullad',ARRAY[150]::int[],NULL,false,true,18),
('burgers-aloo-tikki','Aloo Tikki','burgers',ARRAY[50]::int[],NULL,false,true,19),
('burgers-cheese-aloo-tikki','Cheese Aloo Tikki','burgers',ARRAY[70]::int[],NULL,false,true,20),
('burgers-double-cheese-burger','Double Cheese Burger','burgers',ARRAY[80]::int[],NULL,true,true,21),
('burgers-veggie-king-burger','Veggie King Burger','burgers',ARRAY[80]::int[],NULL,false,true,22),
('burgers-cheese-veggie-king-burger','Cheese Veggie King Burger','burgers',ARRAY[90]::int[],NULL,false,true,23),
('burgers-cheese-corn-burger','Cheese Corn Burger','burgers',ARRAY[90]::int[],NULL,false,true,24),
('burgers-cheese-paneer-fillet','Cheese Paneer Fillet','burgers',ARRAY[100]::int[],NULL,false,true,25),
('sandwiches-mix-veg-sandwich','Mix Veg Sandwich','sandwiches',ARRAY[80]::int[],NULL,false,true,26),
('sandwiches-pasta-sandwich','Pasta Sandwich','sandwiches',ARRAY[100]::int[],NULL,false,true,27),
('sandwiches-cheese-corn-sandwich','Cheese Corn Sandwich','sandwiches',ARRAY[100]::int[],NULL,false,true,28),
('sandwiches-tandoori-sandwich','Tandoori Sandwich','sandwiches',ARRAY[110]::int[],NULL,false,true,29),
('sandwiches-cheese-paneer-sandwich','Cheese Paneer Sandwich','sandwiches',ARRAY[120]::int[],NULL,false,true,30),
('pasta-white-sauce-pasta','White Sauce Pasta','pasta',ARRAY[120]::int[],NULL,false,true,31),
('pasta-red-sauce-pasta','Red Sauce Pasta','pasta',ARRAY[120]::int[],NULL,false,true,32),
('pasta-mix-sauce-pasta','Mix Sauce Pasta','pasta',ARRAY[150]::int[],NULL,false,true,33),
('garlic-bread-stick-garlic-bread','Stick Garlic Bread','garlic-bread',ARRAY[100]::int[],NULL,false,true,34),
('garlic-bread-stuff-garlic-bread','Stuff Garlic Bread','garlic-bread',ARRAY[120]::int[],NULL,false,true,35),
('garlic-bread-cheese-bite','Cheese Bite','garlic-bread',ARRAY[150]::int[],NULL,false,true,36),
('fries-crispy-french-fries','Crispy French Fries','fries',ARRAY[80]::int[],NULL,false,true,37),
('fries-masala-fries','Masala Fries','fries',ARRAY[90]::int[],NULL,false,true,38),
('fries-peri-peri-fries','Peri Peri Fries','fries',ARRAY[120]::int[],NULL,true,true,39),
('wraps-spicy-wrap','Spicy Wrap','wraps',ARRAY[80]::int[],NULL,false,true,40),
('wraps-veg-spicy-wrap','Veg. Spicy Wrap','wraps',ARRAY[90]::int[],NULL,false,true,41),
('wraps-paneer-wrap','Paneer Wrap','wraps',ARRAY[120]::int[],NULL,false,true,42),
('mojito-classic-mojito','Classic Mojito','mojito',ARRAY[90]::int[],NULL,false,true,43),
('mojito-green-apple-mojito','Green Apple Mojito','mojito',ARRAY[100]::int[],NULL,false,true,44),
('mojito-soft-mojito','Soft Mojito','mojito',ARRAY[100]::int[],NULL,false,true,45),
('mojito-zeera-lemon-mojito','Zeera Lemon Mojito','mojito',ARRAY[120]::int[],NULL,false,true,46),
('mojito-lemon-mojito','Lemon Mojito','mojito',ARRAY[120]::int[],NULL,false,true,47),
('mojito-watermelon-mojito','Watermelon Mojito','mojito',ARRAY[120]::int[],NULL,false,true,48),
('mojito-fresh-mojito','Fresh Mojito','mojito',ARRAY[140]::int[],NULL,false,true,49),
('shakes-oreo-with-kit-kat-shake','Oreo with Kit Kat Shake','shakes',ARRAY[130]::int[],NULL,true,true,50),
('shakes-chocolate-shake','Chocolate Shake','shakes',ARRAY[100]::int[],NULL,false,true,51),
('shakes-strawberry-shake','Strawberry Shake','shakes',ARRAY[100]::int[],NULL,false,true,52),
('shakes-butter-scotch-shake','Butter Scotch Shake','shakes',ARRAY[100]::int[],NULL,false,true,53),
('shakes-banana-shake','Banana Shake','shakes',ARRAY[80]::int[],NULL,false,true,54),
('shakes-mango-shake','Mango Shake','shakes',ARRAY[90]::int[],NULL,false,true,55),
('cold-coffee-classic-cold-coffee','Classic Cold Coffee','cold-coffee',ARRAY[80]::int[],NULL,true,true,56),
('cold-coffee-ice-cold-coffee','Ice Cold Coffee','cold-coffee',ARRAY[100]::int[],NULL,false,true,57),
('cold-coffee-chocolate-cold-coffee','Chocolate Cold Coffee','cold-coffee',ARRAY[120]::int[],NULL,false,true,58),
('cold-coffee-strong-cold-coffee','Strong Cold Coffee','cold-coffee',ARRAY[120]::int[],NULL,false,true,59),
('hot-coffee-regular-hot-coffee','Regular Hot Coffee','hot-coffee',ARRAY[50]::int[],NULL,false,true,60),
('hot-coffee-black-hot-coffee','Black Hot Coffee','hot-coffee',ARRAY[60]::int[],NULL,false,true,61),
('hot-coffee-strong-hot-coffee','Strong Hot Coffee','hot-coffee',ARRAY[70]::int[],NULL,false,true,62),
('hot-coffee-chocolate-hot-coffee','Chocolate Hot Coffee','hot-coffee',ARRAY[100]::int[],NULL,false,true,63),
('hot-coffee-creamy-hot-coffee','Creamy Hot Coffee','hot-coffee',ARRAY[100]::int[],NULL,false,true,64),
('hot-coffee-brown-hot-coffee','Brown Hot Coffee','hot-coffee',ARRAY[110]::int[],NULL,false,true,65),
('other-chocolava-cake','Chocolava Cake','other',ARRAY[80]::int[],NULL,false,true,66);

INSERT INTO public.offers (id,kind,title,price,items,text,sort) VALUES
('two','combo','Meal for Two',450,ARRAY['Medium Cheese Burst Pizza','Grilled Cheese Sandwich','Cold Drink (600 ml)']::text[],NULL,0),
('three','combo','Meal for Three',550,ARRAY['Medium Super Magic Pizza','Small Super Veg Pizza','Cold Drink (600 ml)','White Sauce Pasta']::text[],NULL,1),
('four','combo','Meal for Four',800,ARRAY['Veg Supreme Pizza','2 Aloo Tikki Burgers','2 Grilled Sandwiches','Cold Drink (1.25 L)','French Fries']::text[],NULL,2),
('pizza-deal','deal','Pizza Offer',NULL,ARRAY[]::text[],'Buy 2 mix Large pizzas, get 1 Regular pizza free.',10),
('burger-deal','deal','Burger Offer',NULL,ARRAY[]::text[],'Buy 2 mix Medium pizzas, get 1 Aloo Tikki burger free.',11);