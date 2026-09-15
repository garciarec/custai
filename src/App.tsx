import {
  ArrowLeft,
  ArrowRight,
  CakeSlice,
  Check,
  ChevronDown,
  ChevronUp,
  Cookie,
  CupSoda,
  IceCreamBowl,
  Edit3,
  Download,
  Upload,
  Pizza,
  Plus,
  RotateCcw,
  Sandwich,
  Save,
  Store,
  Trash2,
  Truck,
  Utensils,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Step =
  | "quickDelivery"
  | "category"
  | "product"
  | "ingredients"
  | "yield"
  | "extras"
  | "margin"
  | "channel"
  | "result";

type PackagingMode = "batch" | "unit";

type Unit =
  | "mg"
  | "g"
  | "kg"
  | "ml"
  | "L"
  | "un"
  | "duzia";

type Ingredient = {
  id: string;
  name: string;
  packages: number;
  quantityPerPackage: number;
  purchaseUnit: Unit;
  price: number;
  usedQuantity: number;
  usedUnit: Unit;
};

type SavedProduct = {
  id: string;
  name: string;
  category: string;
  ingredients: Ingredient[];
  yieldQuantity: number;
  yieldUnit: Unit;
  saleQuantity: number;
  saleUnit: Unit;
  otherCosts: number;
  packagingCost: number;
  packagingMode?: PackagingMode;
  laborCost: number;
  wastePercent: number;
  margin: number;
  currentPrice: number;
  channel: Channel;
  createdAt: string;
};

type Channel = {
  id: string;
  name: string;
  variableRate: number;
  fixedFee: number;
  monthlyFee: number;
  expectedMonthlyOrders: number;
  safetyRate: number;
  anticipationRate: number;
  useAnticipation: boolean;
};

const categories = [
  {
    name: "Açaíteria",
    description: "Açaí, sorvetes e complementos",
    icon: IceCreamBowl,
  },
  {
    name: "Confeitaria",
    description: "Doces, bolos e sobremesas",
    icon: CakeSlice,
  },
  {
    name: "Padaria",
    description: "Pães, cafés e produtos de padaria",
    icon: Store,
  },
  {
    name: "Doceria",
    description: "Brigadeiros, brownies e doces",
    icon: Cookie,
  },
  {
    name: "Salgados",
    description: "Coxinhas, esfihas e salgados",
    icon: Utensils,
  },
  {
    name: "Bolos",
    description: "Bolos inteiros, fatias e potes",
    icon: CakeSlice,
  },
  {
    name: "Lanches",
    description: "Hambúrgueres, sanduíches e combos",
    icon: Sandwich,
  },
  {
    name: "Pizzaria",
    description: "Pizzas e combos",
    icon: Pizza,
  },
  {
    name: "Bebidas",
    description: "Bebidas, cafés e drinks",
    icon: CupSoda,
  },
  {
    name: "Marmitas",
    description: "Marmitas e refeições",
    icon: Utensils,
  },
];

const productSuggestions: Record<string, string[]> = {
  Açaíteria: [
    "Açaí 300ml",
    "Açaí 400ml",
    "Açaí 500ml",
    "Açaí 700ml",
    "Barca de açaí",
    "Pote de açaí",
  ],
  Confeitaria: [
    "Bolo inteiro",
    "Bolo por kg",
    "Bolo no pote",
    "Brownie",
    "Brigadeiro",
    "Cone trufado",
  ],
  Padaria: [
    "Pão",
    "Pão de queijo",
    "Salgado",
    "Bolo",
    "Café",
    "Combo",
  ],
  Doceria: [
    "Brigadeiro",
    "Beijinho",
    "Brownie",
    "Trufa",
    "Doce",
    "Caixa de doces",
  ],
  Salgados: [
    "Coxinha",
    "Esfiha",
    "Bolinha de queijo",
    "Risoles",
    "Salgado assado",
    "Combo",
  ],
  Bolos: [
    "Bolo inteiro",
    "Bolo por kg",
    "Fatia",
    "Bolo no pote",
    "Mini bolo",
  ],
  Lanches: [
    "Hambúrguer",
    "X-Salada",
    "X-Bacon",
    "Hot dog",
    "Sanduíche",
    "Combo",
  ],
  Pizzaria: [
    "Pizza pequena",
    "Pizza média",
    "Pizza grande",
    "Pizza brotinho",
    "Calzone",
    "Combo",
  ],
  Bebidas: [
    "Café",
    "Suco",
    "Milk-shake",
    "Vitamina",
    "Drink",
    "Bebida 500ml",
  ],
  Marmitas: [
    "Marmita pequena",
    "Marmita média",
    "Marmita grande",
    "Marmita fitness",
    "Marmita executiva",
    "Combo",
  ],
  Personalizado: [],
};

const marginSuggestions = [
  { label: "30%", value: 30 },
  { label: "40%", value: 40 },
  { label: "50%", value: 50 },
  { label: "60%", value: 60 },
];

const channels: Channel[] = [
  {
    id: "none",
    name: "Venda direta",
    variableRate: 0,
    fixedFee: 0,
    monthlyFee: 0,
    expectedMonthlyOrders: 0,
    safetyRate: 0,
    anticipationRate: 0,
    useAnticipation: false,
  },
  {
    id: "ifood",
    name: "iFood",
    variableRate: 26.2,
    fixedFee: 0,
    monthlyFee: 150,
    expectedMonthlyOrders: 0,
    safetyRate: 2,
    anticipationRate: 1.59,
    useAnticipation: false,
  },
  {
    id: "99food",
    name: "99Food",
    variableRate: 12,
    fixedFee: 0,
    monthlyFee: 0,
    expectedMonthlyOrders: 0,
    safetyRate: 2,
    anticipationRate: 1.59,
    useAnticipation: false,
  },
  {
    id: "rappi",
    name: "Rappi",
    variableRate: 27,
    fixedFee: 0,
    monthlyFee: 0,
    expectedMonthlyOrders: 0,
    safetyRate: 2,
    anticipationRate: 0,
    useAnticipation: false,
  },
  {
    id: "custom",
    name: "Outro canal",
    variableRate: 0,
    fixedFee: 0,
    monthlyFee: 0,
    expectedMonthlyOrders: 0,
    safetyRate: 0,
    anticipationRate: 0,
    useAnticipation: false,
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(value) ? value : 0);
}

function parseNumber(value: string) {
  const normalized = value.replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 3,
  }).format(value);
}

function getUnitGroup(unit: Unit) {
  if (["mg", "g", "kg"].includes(unit)) return "weight";
  if (["ml", "L"].includes(unit)) return "volume";
  return "quantity";
}

function convertToBase(quantity: number, unit: Unit) {
  if (unit === "mg") return quantity / 1000;
  if (unit === "g") return quantity;
  if (unit === "kg") return quantity * 1000;

  if (unit === "ml") return quantity;
  if (unit === "L") return quantity * 1000;

  if (unit === "duzia") return quantity * 12;

  return quantity;
}


function canConvert(from: Unit, to: Unit) {
  return getUnitGroup(from) === getUnitGroup(to);
}


function formatUnitLabel(unit: Unit) {
  if (unit === "un") return "unidade";
  if (unit === "duzia") return "dúzia";
  return unit;
}

function calculateIngredientCost(ingredient: Ingredient) {
  const purchasedTotal = ingredient.packages * ingredient.quantityPerPackage;

  if (
    purchasedTotal <= 0 ||
    ingredient.price < 0 ||
    ingredient.usedQuantity <= 0
  ) {
    return 0;
  }

  if (!canConvert(ingredient.purchaseUnit, ingredient.usedUnit)) {
    return 0;
  }

  const purchasedBase = convertToBase(
    purchasedTotal,
    ingredient.purchaseUnit,
  );

  const usedBase = convertToBase(
    ingredient.usedQuantity,
    ingredient.usedUnit,
  );

  if (purchasedBase <= 0) return 0;

  return (ingredient.price / purchasedBase) * usedBase;
}

function roundCommercial(value: number, mode: string) {
  if (value <= 0) return 0;

  if (mode === "0.50") {
    return Math.ceil(value * 2) / 2;
  }

  if (mode === "0.90") {
    const nextTenth = Math.ceil((value - 0.001) * 10) / 10;
    return Math.max(0, nextTenth - 0.01);
  }

  if (mode === "1.00") {
    return Math.ceil(value);
  }

  return value;
}


function BrandMark() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M65 27C58 21 50 18 41 18C22 18 7 33 7 52C7 71 22 86 41 86C50 86 58 83 65 77"
        stroke="currentColor"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <circle cx="72" cy="52" r="6" fill="currentColor" />
    </svg>
  );
}

function App() {
  const [step, setStep] = useState<Step>("category");

  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingredient, setIngredient] = useState<Ingredient>({
    id: "",
    name: "",
    packages: 1,
    quantityPerPackage: 1,
    purchaseUnit: "kg",
    price: 0,
    usedQuantity: 0,
    usedUnit: "g",
  });

  const [yieldQuantity, setYieldQuantity] = useState(1);
  const [yieldUnit, setYieldUnit] = useState<Unit>("un");
  const [saleQuantity, setSaleQuantity] = useState(1);
  const [saleUnit, setSaleUnit] = useState<Unit>("un");

  const [packagingCost, setPackagingCost] = useState(0);
  const [packagingMode, setPackagingMode] = useState<PackagingMode>("batch");
  const [otherCosts, setOtherCosts] = useState(0);

  const [includeLabor, setIncludeLabor] = useState(false);
  const [hourlyValue, setHourlyValue] = useState(0);
  const [activeHours, setActiveHours] = useState(0);

  const [wastePercent, setWastePercent] = useState(0);

  const [margin, setMargin] = useState(40);
  const [customMargin, setCustomMargin] = useState(40);

  const [channel, setChannel] = useState<Channel>(channels[0]);
  const [customChannelName, setCustomChannelName] = useState("Outro canal");

  const [commercialRounding, setCommercialRounding] = useState("0.90");

  const [currentPrice, setCurrentPrice] = useState(0);

  // Etapa 8: metas e simulação de preço
  const [monthlyProfitTarget, setMonthlyProfitTarget] = useState(0);
  const [simulationPrice, setSimulationPrice] = useState(0);
  const [showPlanning, setShowPlanning] = useState(false);

  // Cálculo rápido de delivery: o comerciante escolhe o modelo que usa.
  // O Custaí estima as taxas por trás dessas escolhas, sem exigir que ele saiba os percentuais.
  const [quickDeliveryPrice, setQuickDeliveryPrice] = useState(0);
  const [quickDeliveryChannel, setQuickDeliveryChannel] = useState<Channel>(channels[1]);
  const [quickDeliveryDeliveryMode, setQuickDeliveryDeliveryMode] = useState<"own" | "platform">("platform");
  const [quickDeliveryPaymentOnline, setQuickDeliveryPaymentOnline] = useState(true);
  const [quickDeliveryPayoutMode, setQuickDeliveryPayoutMode] = useState<"standard" | "weekly" | "advance">("standard");
  const [quickDeliverySafetyRate, setQuickDeliverySafetyRate] = useState(2);
  const [quickDeliveryUnknownCostReserve, setQuickDeliveryUnknownCostReserve] = useState(0);
  const [quickDeliveryFixedFee, setQuickDeliveryFixedFee] = useState(0);
  const [quickDeliveryMonthlyFee, setQuickDeliveryMonthlyFee] = useState(0);
  const [quickDeliveryMonthlyOrders, setQuickDeliveryMonthlyOrders] = useState(0);
  const [quickDeliveryMonthlyFeeActive, setQuickDeliveryMonthlyFeeActive] = useState(false);
  const [quickDeliveryRounding, setQuickDeliveryRounding] = useState("0.90");
  const [showQuickDeliveryAdvanced, setShowQuickDeliveryAdvanced] = useState(false);

  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [showDetails, setShowDetails] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [editingIngredientId, setEditingIngredientId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("calculadora-precos-produtos");

    if (stored) {
      try {
        setSavedProducts(JSON.parse(stored));
      } catch {
        setSavedProducts([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "calculadora-precos-produtos",
      JSON.stringify(savedProducts),
    );
  }, [savedProducts]);

  const laborCost = includeLabor
    ? Math.max(0, hourlyValue) * Math.max(0, activeHours)
    : 0;

  const ingredientTotal = useMemo(
    () => ingredients.reduce((sum, item) => sum + calculateIngredientCost(item), 0),
    [ingredients],
  );

  // Perdas são aplicadas aos ingredientes, que são a parte efetivamente
  // consumida/perdida na produção. Os demais custos não são multiplicados.
  const wasteMultiplier = 1 + Math.max(0, wastePercent) / 100;
  const ingredientCostWithWaste = ingredientTotal * wasteMultiplier;

  const yieldBase = convertToBase(yieldQuantity, yieldUnit);

  const salePortionBase = convertToBase(saleQuantity, saleUnit);
  const saleUnitsPerBatch =
    yieldBase > 0 && salePortionBase > 0 && canConvert(yieldUnit, saleUnit)
      ? yieldBase / salePortionBase
      : 0;

  const packagingCostForBatch =
    packagingMode === "unit" && saleUnitsPerBatch > 0
      ? packagingCost * saleUnitsPerBatch
      : packagingCost;

  const subtotal =
    ingredientCostWithWaste +
    packagingCostForBatch +
    otherCosts +
    laborCost;

  const totalCost = subtotal;


  const costPerUnit =
    saleUnitsPerBatch > 0 ? totalCost / saleUnitsPerBatch : 0;

  const marginValue = Math.min(
    99,
    Math.max(0, margin === -1 ? customMargin : margin),
  );

  const directPrice =
    marginValue >= 100
      ? 0
      : costPerUnit / (1 - marginValue / 100);

  // A margem de segurança protege contra pequenas mudanças nas taxas.
  // A antecipação é calculada separadamente sobre o valor que seria repassado.
  const platformRate =
    Math.max(0, channel.variableRate) + Math.max(0, channel.safetyRate);

  const anticipationRate = channel.useAnticipation
    ? Math.max(0, channel.anticipationRate)
    : 0;

  const effectiveVariableRate =
    1 - (1 - Math.min(99.99, platformRate) / 100) *
      (1 - Math.min(99.99, anticipationRate) / 100);

  const monthlyFeePerOrder =
    channel.monthlyFee > 0 && channel.expectedMonthlyOrders > 0
      ? channel.monthlyFee / channel.expectedMonthlyOrders
      : 0;

  const platformRetention = Math.max(0, 1 - platformRate / 100);
  const anticipationRetention = Math.max(0, 1 - anticipationRate / 100);

  const channelPrice =
    platformRetention <= 0 || anticipationRetention <= 0
      ? 0
      : (directPrice + channel.fixedFee + monthlyFeePerOrder) /
        (platformRetention * anticipationRetention);

  const finalExactPrice =
    channel.id === "none" ? directPrice : channelPrice;

  const recommendedPrice = roundCommercial(
    finalExactPrice,
    commercialRounding,
  );

  const estimatedNetRevenue =
    channel.id === "none"
      ? recommendedPrice
      : Math.max(
          0,
          (recommendedPrice - channel.fixedFee - monthlyFeePerOrder) *
            platformRetention *
            anticipationRetention,
        );

  const actualProfitAtRecommended = estimatedNetRevenue - costPerUnit;

  const actualNetMarginAtRecommended =
    estimatedNetRevenue > 0
      ? (actualProfitAtRecommended / estimatedNetRevenue) * 100
      : 0;

  const recommendedMonthlyUnits =
    monthlyProfitTarget > 0 && actualProfitAtRecommended > 0
      ? Math.ceil(monthlyProfitTarget / actualProfitAtRecommended)
      : 0;

  const recommendedWeeklyUnits =
    recommendedMonthlyUnits > 0
      ? Math.ceil(recommendedMonthlyUnits / 4.33)
      : 0;

  const recommendedDailyUnits =
    recommendedMonthlyUnits > 0
      ? Math.ceil(recommendedMonthlyUnits / 30)
      : 0;

  const simulationNetRevenue =
    simulationPrice > 0
      ? channel.id === "none"
        ? simulationPrice
        : Math.max(
            0,
            (simulationPrice - channel.fixedFee - monthlyFeePerOrder) *
              platformRetention *
              anticipationRetention,
          )
      : 0;

  const simulationProfit =
    simulationPrice > 0 ? simulationNetRevenue - costPerUnit : 0;

  const simulationMargin =
    simulationNetRevenue > 0
      ? (simulationProfit / simulationNetRevenue) * 100
      : 0;

  const quickDeliveryKnownRate = useMemo(() => {
    if (quickDeliveryChannel.id === "ifood") {
      const commission = quickDeliveryDeliveryMode === "platform" ? 23 : 12;
      const onlinePayment = quickDeliveryPaymentOnline ? 3.2 : 0;
      return commission + onlinePayment;
    }

    if (quickDeliveryChannel.id === "99food") {
      // A 99Food informa 12% como referência de comissão.
      // Pagamento online e logística podem variar; entram na reserva abaixo.
      return 12;
    }

    if (quickDeliveryChannel.id === "rappi") {
      // Referências atuais da Rappi: 3,5% em uma modalidade de entrega própria
      // e 27% no plano em que a Rappi faz a entrega. O contrato pode variar.
      return quickDeliveryDeliveryMode === "platform" ? 27 : 3.5;
    }

    return Math.max(0, quickDeliveryChannel.variableRate);
  }, [
    quickDeliveryChannel.id,
    quickDeliveryChannel.variableRate,
    quickDeliveryDeliveryMode,
    quickDeliveryPaymentOnline,
  ]);

  const quickDeliveryPayoutRate =
    quickDeliveryChannel.id === "ifood" && quickDeliveryPayoutMode !== "standard"
      ? 1.59
      : 0;

  const quickDeliveryPlatformRate =
    Math.max(0, quickDeliveryKnownRate) +
    Math.max(0, quickDeliveryUnknownCostReserve) +
    Math.max(0, quickDeliveryPayoutRate) +
    Math.max(0, quickDeliverySafetyRate);

  const quickDeliveryPlatformRetention = Math.max(
    0,
    1 - quickDeliveryPlatformRate / 100,
  );

  const quickDeliveryMonthlyFeePerOrder =
    quickDeliveryMonthlyFeeActive &&
    quickDeliveryMonthlyFee > 0 &&
    quickDeliveryMonthlyOrders > 0
      ? quickDeliveryMonthlyFee / quickDeliveryMonthlyOrders
      : 0;

  const quickDeliveryExactPrice =
    quickDeliveryPrice > 0 && quickDeliveryPlatformRetention > 0
      ? (quickDeliveryPrice +
          quickDeliveryFixedFee +
          quickDeliveryMonthlyFeePerOrder) /
        quickDeliveryPlatformRetention
      : 0;

  const quickDeliveryRecommendedPrice = roundCommercial(
    quickDeliveryExactPrice,
    quickDeliveryRounding,
  );

  function resetQuickDelivery() {
    setQuickDeliveryPrice(0);
    setQuickDeliveryChannel({ ...channels[1] });
    setQuickDeliveryDeliveryMode("platform");
    setQuickDeliveryPaymentOnline(true);
    setQuickDeliveryPayoutMode("standard");
    setQuickDeliverySafetyRate(2);
    setQuickDeliveryUnknownCostReserve(0);
    setQuickDeliveryFixedFee(0);
    setQuickDeliveryMonthlyFee(0);
    setQuickDeliveryMonthlyOrders(0);
    setQuickDeliveryMonthlyFeeActive(false);
    setQuickDeliveryRounding("0.90");
    setShowQuickDeliveryAdvanced(false);
    setError("");
  }

  function resetCalculation() {
    resetQuickDelivery();
    setStep("category");
    setCategory("");
    setProductName("");
    setIngredients([]);
    setIngredient({
      id: "",
      name: "",
      packages: 1,
      quantityPerPackage: 1,
      purchaseUnit: "kg",
      price: 0,
      usedQuantity: 0,
      usedUnit: "g",
    });
    setYieldQuantity(1);
    setYieldUnit("un");
    setSaleQuantity(1);
    setSaleUnit("un");
    setPackagingCost(0);
    setPackagingMode("batch");
    setOtherCosts(0);
    setIncludeLabor(false);
    setHourlyValue(0);
    setActiveHours(0);
    setWastePercent(0);
    setMargin(40);
    setCustomMargin(40);
    setChannel(channels[0]);
    setCustomChannelName("Outro canal");
    setCommercialRounding("0.90");
    setCurrentPrice(0);
    setMonthlyProfitTarget(0);
    setSimulationPrice(0);
    setShowPlanning(false);
    setShowDetails(false);
    setShowAdvanced(false);
    setEditingIngredientId(null);
    setEditingProductId(null);
    setError("");
  }

  function goBack() {
    setError("");

    if (step === "quickDelivery") {
      setStep("category");
      return;
    }

    if (step === "product") setStep("category");
    else if (step === "ingredients") setStep("product");
    else if (step === "yield") setStep("ingredients");
    else if (step === "extras") setStep("yield");
    else if (step === "margin") setStep("extras");
    else if (step === "channel") setStep("margin");
    else if (step === "result") setStep("channel");
  }

  function addIngredient() {
    setError("");

    if (!ingredient.name.trim()) {
      setError("Digite o nome do ingrediente.");
      return;
    }

    if (ingredient.packages <= 0) {
      setError("Informe quantas embalagens você comprou.");
      return;
    }

    if (ingredient.quantityPerPackage <= 0) {
      setError("Informe quanto vem em cada embalagem.");
      return;
    }

    if (ingredient.price <= 0) {
      setError("Informe quanto você pagou.");
      return;
    }

    if (ingredient.usedQuantity <= 0) {
      setError("Informe quanto você usa na receita.");
      return;
    }

    if (!canConvert(ingredient.purchaseUnit, ingredient.usedUnit)) {
      setError(
        "Essas unidades não são compatíveis. Escolha unidades de peso, volume ou quantidade da mesma categoria.",
      );
      return;
    }

    const updated = {
      ...ingredient,
      id:
        editingIngredientId ??
        `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    };

    if (editingIngredientId) {
      setIngredients((current) =>
        current.map((item) =>
          item.id === editingIngredientId ? updated : item,
        ),
      );
    } else {
      setIngredients((current) => [...current, updated]);
    }

    setEditingIngredientId(null);

    setIngredient({
      id: "",
      name: "",
      packages: 1,
      quantityPerPackage: 1,
      purchaseUnit: ingredient.purchaseUnit,
      price: 0,
      usedQuantity: 0,
      usedUnit: ingredient.usedUnit,
    });
  }

  function editIngredient(item: Ingredient) {
    setIngredient(item);
    setEditingIngredientId(item.id);
    setError("");
  }

  function deleteIngredient(id: string) {
    setIngredients((current) => current.filter((item) => item.id !== id));
  }

  function continueFromIngredients() {
    setError("");

    if (ingredients.length === 0) {
      setError("Adicione pelo menos um ingrediente.");
      return;
    }

    setStep("yield");
  }

  function continueFromYield() {
    setError("");

    if (yieldQuantity <= 0) {
      setError("Informe quanto essa receita rende.");
      return;
    }

    if (saleQuantity <= 0) {
      setError("Informe como você vende esse produto.");
      return;
    }

    if (!canConvert(yieldUnit, saleUnit)) {
      setError(
        "O rendimento e a unidade de venda precisam ser do mesmo tipo: peso, volume ou quantidade.",
      );
      return;
    }

    if (salePortionBase <= 0 || saleUnitsPerBatch <= 0) {
      setError("Confira o tamanho da porção ou unidade de venda.");
      return;
    }

    setStep("extras");
  }

  function continueFromExtras() {
    setError("");
    setStep("margin");
  }

  function continueFromMargin() {
    setError("");

    if (marginValue <= 0 || marginValue >= 100) {
      setError("Escolha uma margem entre 1% e 99%.");
      return;
    }

    setStep("channel");
  }

  function continueFromChannel() {
    setError("");

    if (channel.id === "custom" && !customChannelName.trim()) {
      setError("Digite o nome do canal.");
      return;
    }

    setStep("result");
  }

  function getProductSnapshot(id: string, nameOverride?: string): SavedProduct {
    return {
      id,
      name: nameOverride ?? (productName || "Produto sem nome"),
      category,
      ingredients,
      yieldQuantity,
      yieldUnit,
      saleQuantity,
      saleUnit,
      otherCosts,
      packagingCost,
      packagingMode,
      laborCost,
      wastePercent,
      margin: marginValue,
      currentPrice,
      channel,
      createdAt: new Date().toISOString(),
    };
  }

  function saveProduct() {
    const id = editingProductId ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const product = getProductSnapshot(id);

    if (editingProductId) {
      setSavedProducts((current) =>
        current.map((item) => (item.id === editingProductId ? { ...product, createdAt: item.createdAt } : item)),
      );
    } else {
      setSavedProducts((current) => [product, ...current]);
    }

    setEditingProductId(id);
  }

  function loadProduct(product: SavedProduct) {
    setCategory(product.category);
    setProductName(product.name);
    setIngredients(product.ingredients);
    setYieldQuantity(product.yieldQuantity);
    setYieldUnit(product.yieldUnit);
    setSaleQuantity(product.saleQuantity ?? 1);
    setSaleUnit(product.saleUnit ?? product.yieldUnit);
    setOtherCosts(product.otherCosts);
    setPackagingCost(product.packagingCost);
    setPackagingMode(product.packagingMode ?? "batch");
    setLaborCostFromSaved(product.laborCost);
    setWastePercent(product.wastePercent);
    setMargin(product.margin);
    setCurrentPrice(product.currentPrice);
    setChannel(product.channel);
    setEditingProductId(product.id);
    setError("");
    setStep("result");
  }

  function duplicateProduct(product: SavedProduct) {
    const copy: SavedProduct = {
      ...product,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: `${product.name} (cópia)`,
      ingredients: product.ingredients.map((item) => ({ ...item })),
      createdAt: new Date().toISOString(),
    };

    setSavedProducts((current) => [copy, ...current]);
    loadProduct(copy);
  }

  function exportData() {
    const backup = {
      app: "Custaí",
      version: 1,
      exportedAt: new Date().toISOString(),
      products: savedProducts,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `custai-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function importData(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const products = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed?.products)
            ? parsed.products
            : null;

        if (!products) {
          throw new Error("Arquivo inválido");
        }

        const validProducts = products.filter(
          (item: unknown): item is SavedProduct => {
            if (!item || typeof item !== "object") return false;
            const product = item as Partial<SavedProduct>;
            return (
              typeof product.id === "string" &&
              typeof product.name === "string" &&
              typeof product.category === "string" &&
              Array.isArray(product.ingredients)
            );
          },
        );

        if (validProducts.length !== products.length) {
          throw new Error("Arquivo inválido");
        }

        const normalizedProducts = validProducts.map((product: SavedProduct) => ({
          ...product,
          saleQuantity: product.saleQuantity ?? 1,
          saleUnit: product.saleUnit ?? product.yieldUnit,
          packagingMode: product.packagingMode ?? "batch",
        }));

        const shouldReplace = window.confirm(
          "Importar este backup vai substituir os produtos salvos neste aparelho. Continuar?",
        );

        if (!shouldReplace) return;

        setSavedProducts(normalizedProducts);
        setEditingProductId(null);
        setError("");
        setStep("category");
        window.alert(
          `${normalizedProducts.length} produto${normalizedProducts.length === 1 ? "" : "s"} importado${normalizedProducts.length === 1 ? "" : "s"} com sucesso.`,
        );
      } catch {
        window.alert("Não foi possível importar este arquivo. Use um backup do Custaí.");
      }
    };

    reader.readAsText(file);
  }

  function setLaborCostFromSaved(value: number) {
    if (value > 0) {
      setIncludeLabor(true);
      setActiveHours(1);
      setHourlyValue(value);
    } else {
      setIncludeLabor(false);
      setActiveHours(0);
      setHourlyValue(0);
    }
  }

  function getStepTitle() {
    if (step === "quickDelivery") return "Quanto cobrar no delivery?";
    if (step === "category") return "O que você vende?";
    if (step === "product") return "O que você quer calcular?";
    if (step === "ingredients") return "Quanto ele custa?";
    if (step === "yield") return "Quanto essa receita rende?";
    if (step === "extras") return "Tem outros custos?";
    if (step === "margin") return "Quanto você quer ganhar?";
    if (step === "channel") return "Onde você vai vender?";
    return "Esse é um bom preço?";
  }

  const progressMap: Record<Step, number> = {
    quickDelivery: 0,
    category: 1,
    product: 2,
    ingredients: 3,
    yield: 4,
    extras: 5,
    margin: 6,
    channel: 7,
    result: 8,
  };

  const progress = progressMap[step];

  function renderHeader() {
    if (step === "quickDelivery") {
      return (
        <header className="mb-8">
          <button
            onClick={goBack}
            className="mb-7 flex items-center gap-2 text-[14px] font-medium text-neutral-500 transition hover:text-neutral-900"
          >
            <ArrowLeft size={17} />
            Voltar
          </button>

          <div className="mb-5 flex items-center gap-3">
            <div className="custai-brand-mark text-white">
              <BrandMark />
            </div>
            <span className="custai-brand-name">Custaí</span>
          </div>

          <h1 className="custai-title max-w-xl">Quanto cobrar no delivery?</h1>

          <p className="custai-description mt-4 max-w-lg">
            Você já sabe o preço do seu produto? Informe esse valor e descubra quanto cobrar em cada plataforma.
          </p>
        </header>
      );
    }

    if (step === "category") {
      return (
        <header className="mb-11">
          <div className="mb-10 flex items-center gap-3">
            <div className="custai-brand-mark text-white">
              <BrandMark />
            </div>

            <span className="custai-brand-name">
              Custaí
            </span>
          </div>

          <h1 className="custai-title max-w-xl">
            Quanto você deve cobrar?
          </h1>

          <p className="custai-description mt-4 max-w-lg">
            Calcule o custo do seu produto e encontre um preço de venda
            adequado para o seu negócio.
          </p>
        </header>
      );
    }

    return (
      <header className="mb-7">
        <button
          onClick={goBack}
          className="mb-7 flex items-center gap-2 text-[14px] font-medium text-neutral-500 transition hover:text-neutral-900"
        >
          <ArrowLeft size={17} />
          Voltar
        </button>

        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-[#0F6B50] transition-all duration-300"
            style={{ width: `${(progress / 8) * 100}%` }}
          />
        </div>

        <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-400">
          Etapa {progress} de 8
        </p>

        <h1 className="mt-2 text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] text-neutral-950">
          {getStepTitle()}
        </h1>
      </header>
    );
  }

  function renderQuickDelivery() {
    const selectedChannelName =
      quickDeliveryChannel.id === "custom"
        ? "Outro canal"
        : quickDeliveryChannel.name;

    const isIfood = quickDeliveryChannel.id === "ifood";
    const is99Food = quickDeliveryChannel.id === "99food";
    const isRappi = quickDeliveryChannel.id === "rappi";

    const setQuickChannel = (item: Channel) => {
      setQuickDeliveryChannel({ ...item });

      if (item.id === "ifood" || item.id === "99food" || item.id === "rappi") {
        setQuickDeliveryDeliveryMode("platform");
      }

      setQuickDeliveryPayoutMode(item.id === "ifood" ? "standard" : "weekly");
      setQuickDeliveryUnknownCostReserve(
        item.id === "99food" ? 3 : 0,
      );
      setQuickDeliveryMonthlyFeeActive(false);
      setQuickDeliveryMonthlyFee(0);
      setQuickDeliveryMonthlyOrders(0);
    };

    const deliveryOptions = isIfood
      ? [
          {
            value: "own" as const,
            title: "Entrega própria",
            description: "Você ou seu motoboy faz a entrega.",
          },
          {
            value: "platform" as const,
            title: "Entrega pelo iFood",
            description: "A entrega é feita pela logística do iFood.",
          },
        ]
      : is99Food
        ? [
            {
              value: "own" as const,
              title: "Entrega própria",
              description: "A entrega fica por sua conta.",
            },
            {
              value: "platform" as const,
              title: "Entrega pela 99Food",
              description: "A 99Food participa da logística.",
            },
          ]
        : isRappi
          ? [
              {
                value: "own" as const,
                title: "Entrega própria",
                description: "Você faz a entrega.",
              },
              {
                value: "platform" as const,
                title: "Entrega pela Rappi",
                description: "A Rappi participa da logística.",
              },
            ]
          : [];

    const payoutOptions = isIfood
      ? [
          {
            value: "standard" as const,
            title: "Repasse tradicional",
            description: "Recebimento no ciclo normal.",
          },
          {
            value: "weekly" as const,
            title: "Repasse semanal",
            description: "Recebe com maior frequência.",
          },
          {
            value: "advance" as const,
            title: "Antecipação",
            description: "Recebe antes do ciclo normal.",
          },
        ]
      : is99Food
        ? [
            {
              value: "weekly" as const,
              title: "Repasse semanal",
              description: "A 99Food informa repasses semanais.",
            },
          ]
        : isRappi
          ? [
              {
                value: "weekly" as const,
                title: "Repasse semanal",
                description: "A Rappi informa pagamento semanal.",
              },
            ]
          : [
              {
                value: "standard" as const,
                title: "Repasse normal",
                description: "Use o modelo do seu contrato.",
              },
            ];

    const platformRateLabel = `${quickDeliveryPlatformRate
      .toFixed(2)
      .replace(".", ",")}%`;

    return (
      <>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <Field label="Quanto você cobra hoje por esse produto?">
            <MoneyInput
              value={quickDeliveryPrice}
              onChange={setQuickDeliveryPrice}
            />
          </Field>
          <p className="mt-1 text-[12px] leading-5 text-neutral-400">
            Coloque o preço que você cobra hoje na loja, balcão ou WhatsApp.
          </p>
        </div>

        <div className="mt-4">
          <p className="mb-3 text-[13px] font-medium text-neutral-500">
            Em qual plataforma você vai vender?
          </p>

          <div className="space-y-2">
            {channels
              .filter((item) => item.id !== "none")
              .map((item) => {
                const selected = quickDeliveryChannel.id === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setQuickChannel(item)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "custai-option-selected border-[#0F6B50] bg-[#0F6B50] text-white"
                        : "border-neutral-200 bg-white text-neutral-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          selected ? "custai-option-icon bg-white/10" : "custai-option-icon bg-neutral-100"
                        }`}
                      >
                        <Store size={17} />
                      </div>

                      <div>
                        <p className="text-[14px] font-semibold">{item.name}</p>
                        <p
                          className={`mt-1 text-[11px] ${
                            selected ? "custai-option-description text-white/70" : "custai-option-description text-neutral-400"
                          }`}
                        >
                          O Custaí calcula as taxas por trás da escolha.
                        </p>
                      </div>
                    </div>

                    {selected && <Check size={18} />}
                  </button>
                );
              })}
          </div>
        </div>

        {deliveryOptions.length > 0 && (
          <div className="mt-5">
            <p className="mb-3 text-[13px] font-medium text-neutral-500">
              Quem faz a entrega?
            </p>

            <div className="space-y-2">
              {deliveryOptions.map((option) => {
                const selected =
                  quickDeliveryDeliveryMode === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setQuickDeliveryDeliveryMode(option.value);

                      if (is99Food) {
                        setQuickDeliveryUnknownCostReserve(
                          option.value === "platform" ? 3 : 2,
                        );
                      } else {
                        setQuickDeliveryUnknownCostReserve(0);
                      }
                    }}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "custai-option-selected border-[#0F6B50] bg-[#0F6B50] text-white"
                        : "border-neutral-200 bg-white text-neutral-900"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[14px] font-semibold">
                          {option.title}
                        </p>
                        <p
                          className={`mt-1 text-[11px] ${
                            selected
                              ? "custai-option-description text-white/70"
                              : "custai-option-description text-neutral-400"
                          }`}
                        >
                          {option.description}
                        </p>
                      </div>

                      {selected && <Check size={18} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {(isIfood || is99Food) && (
          <div className="mt-5">
            <p className="mb-3 text-[13px] font-medium text-neutral-500">
              Como o cliente costuma pagar?
            </p>

            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  value: true,
                  title: "Pelo app",
                  description: "Pagamento processado pela plataforma.",
                },
                {
                  value: false,
                  title: "Fora do app",
                  description: "Dinheiro ou outro pagamento direto.",
                },
              ].map((option) => {
                const selected =
                  quickDeliveryPaymentOnline === option.value;

                return (
                  <button
                    key={String(option.value)}
                    onClick={() =>
                      setQuickDeliveryPaymentOnline(option.value)
                    }
                    className={`rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "custai-option-selected border-[#0F6B50] bg-[#0F6B50] text-white"
                        : "border-neutral-200 bg-white text-neutral-900"
                    }`}
                  >
                    <p className="text-[13px] font-semibold">
                      {option.title}
                    </p>
                    <p
                      className={`mt-1 text-[11px] ${
                        selected ? "custai-option-description text-white/70" : "custai-option-description text-neutral-400"
                      }`}
                    >
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-5">
          <p className="mb-3 text-[13px] font-medium text-neutral-500">
            Como você recebe?
          </p>

          <div className="space-y-2">
            {payoutOptions.map((option) => {
              const selected = quickDeliveryPayoutMode === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => setQuickDeliveryPayoutMode(option.value)}
                  className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                    selected
                      ? "custai-option-selected border-[#0F6B50] bg-[#0F6B50] text-white"
                      : "border-neutral-200 bg-white text-neutral-900"
                  }`}
                >
                  <div>
                    <p className="text-[14px] font-semibold">
                      {option.title}
                    </p>
                    <p
                      className={`mt-1 text-[11px] ${
                        selected ? "custai-option-description text-white/70" : "custai-option-description text-neutral-400"
                      }`}
                    >
                      {option.description}
                    </p>
                  </div>

                  {selected && <Check size={18} />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[14px] font-semibold text-neutral-900">
                Proteção para taxas que podem variar
              </p>
              <p className="mt-1 text-[12px] leading-5 text-neutral-400">
                O Custaí adiciona uma pequena reserva para mudanças, taxas
                variáveis ou custos que a plataforma não informa de forma fixa.
              </p>
            </div>

            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-500">
              {quickDeliverySafetyRate}%
            </span>
          </div>

          <div className="mt-4">
            <Field label="Reserva extra (%)">
              <NumberInput
                value={quickDeliverySafetyRate}
                onChange={setQuickDeliverySafetyRate}
              />
            </Field>
          </div>

          {isIfood && quickDeliveryPayoutMode !== "standard" && (
            <div className="mt-3 rounded-xl bg-neutral-50 p-3">
              <p className="text-[12px] font-medium text-neutral-700">
                Reserva de recebimento
              </p>
              <p className="mt-1 text-[11px] leading-5 text-neutral-400">
                O Custaí usa uma estimativa de 1,59% para o recebimento
                antecipado/semanal. A taxa real do seu contrato pode ser
                diferente.
              </p>
            </div>
          )}

          {quickDeliveryUnknownCostReserve > 0 && (
            <div className="mt-3 rounded-xl bg-neutral-50 p-3">
              <p className="text-[12px] font-medium text-neutral-700">
                Reserva para custos variáveis
              </p>
              <p className="mt-1 text-[11px] leading-5 text-neutral-400">
                O Custaí está reservando{" "}
                {quickDeliveryUnknownCostReserve
                  .toFixed(1)
                  .replace(".", ",")}
                % porque esse custo pode depender do pedido, distância ou forma
                de pagamento.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-neutral-200 bg-white">
          <button
            onClick={() =>
              setShowQuickDeliveryAdvanced((value) => !value)
            }
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div>
              <p className="text-[14px] font-semibold text-neutral-900">
                Mensalidade e outros custos
              </p>
              <p className="mt-1 text-[12px] text-neutral-400">
                Opcional. Abra apenas se isso existir no seu plano.
              </p>
            </div>

            {showQuickDeliveryAdvanced ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {showQuickDeliveryAdvanced && (
            <div className="border-t border-neutral-100 p-4">
              {isIfood && (
                <label className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-semibold text-neutral-800">
                      Minha loja paga mensalidade
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-neutral-400">
                      Ative se sua loja estiver sujeita à mensalidade do plano.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={quickDeliveryMonthlyFeeActive}
                    onChange={(event) => {
                      const active = event.target.checked;
                      setQuickDeliveryMonthlyFeeActive(active);
                      setQuickDeliveryMonthlyFee(
                        active
                          ? quickDeliveryDeliveryMode === "platform"
                            ? 150
                            : 110
                          : 0,
                      );
                    }}
                    className="h-5 w-5"
                  />
                </label>
              )}

              {quickDeliveryMonthlyFeeActive && (
                <div className="mt-4">
                  <Field label="Pedidos por mês">
                    <NumberInput
                      value={quickDeliveryMonthlyOrders}
                      onChange={setQuickDeliveryMonthlyOrders}
                    />
                  </Field>
                  <p className="mt-1 text-[11px] leading-5 text-neutral-400">
                    Usamos essa estimativa apenas para dividir a mensalidade
                    por venda.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Field label="Taxa fixa por venda">
                  <MoneyInput
                    value={quickDeliveryFixedFee}
                    onChange={setQuickDeliveryFixedFee}
                  />
                </Field>

                {quickDeliveryChannel.id === "custom" && (
                  <Field label="Taxa do seu canal (%)">
                    <NumberInput
                      value={quickDeliveryChannel.variableRate}
                      onChange={(value) =>
                        setQuickDeliveryChannel((current) => ({
                          ...current,
                          variableRate: value,
                        }))
                      }
                    />
                  </Field>
                )}
              </div>

              <div className="mt-4 rounded-xl bg-neutral-50 p-3">
                <p className="text-[11px] leading-5 text-neutral-500">
                  As taxas reais podem variar por contrato, promoção, forma de
                  pagamento e região. O Custaí usa referências públicas e uma
                  reserva de segurança; quando você souber o valor exato,
                  poderá ajustar em Opções avançadas.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 rounded-3xl bg-neutral-900 p-5 text-white">
          <p className="text-[12px] uppercase tracking-[0.08em] text-neutral-400">
            Preço recomendado no {selectedChannelName}
          </p>

          <p className="mt-2 text-[38px] font-semibold leading-none tracking-[-0.04em]">
            {formatCurrency(quickDeliveryRecommendedPrice)}
          </p>

          <p className="mt-3 text-[12px] leading-5 text-neutral-400">
            A ideia é que, depois das taxas estimadas, você continue recebendo
            aproximadamente{" "}
            <strong className="text-neutral-200">
              {formatCurrency(quickDeliveryPrice)}
            </strong>
            .
          </p>
        </div>

        {quickDeliveryPrice > 0 && quickDeliveryRecommendedPrice > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <SummaryCard
              title="Preço atual"
              value={formatCurrency(quickDeliveryPrice)}
            />
            <SummaryCard
              title="Reserva total"
              value={platformRateLabel}
            />
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-[13px] font-semibold text-neutral-900">
            Arredondamento comercial
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              ["exact", "Exato"],
              ["0.50", "Próximo 0,50"],
              ["0.90", "Próximo 0,90"],
              ["1.00", "Próximo R$ 1"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setQuickDeliveryRounding(value)}
                className={`rounded-xl border px-3 py-3 text-[12px] font-medium ${
                  quickDeliveryRounding === value
                    ? "border-neutral-900 bg-[#0F6B50] text-white"
                    : "border-neutral-200 bg-white text-neutral-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </>
    );
  }

  function renderCategory() {
    return (
      <>
        <div className="mb-4">
          <p className="custai-eyebrow">
            Primeiro passo
          </p>

          <h2 className="mt-1 text-[18px] font-semibold tracking-[-0.02em] text-neutral-900">
            O que você vende?
          </h2>
        </div>

        <button
          onClick={() => {
            resetQuickDelivery();
            setStep("quickDelivery");
          }}
          className="mb-5 flex w-full items-center gap-4 rounded-2xl border border-[#D8E8E1] bg-[#F3F8F5] p-4 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition hover:border-[#BFD8CC] active:scale-[0.99]"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#0F6B50] text-white">
            <Truck size={19} strokeWidth={1.9} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-neutral-900">Já sabe o preço? Calcule para delivery</p>
            <p className="mt-1 text-[12px] leading-5 text-neutral-500">
              Descubra quanto cobrar no iFood, 99Food, Rappi ou outro canal.
            </p>
          </div>
          <ArrowRight size={17} className="shrink-0 text-neutral-500" />
        </button>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => {
                  setCategory(item.name);
                  setProductName("");
                  setStep("product");
                }}
                className="group min-h-[128px] rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] active:scale-[0.98]"
              >
                <div className="custai-category-icon flex h-10 w-10 items-center justify-center rounded-[13px] transition-colors">
                  <Icon size={18} strokeWidth={1.8} />
                </div>

                <div className="mt-6">
                  <p className="text-[15px] font-semibold text-neutral-900">
                    {item.name}
                  </p>

                  <p className="custai-category-description mt-1.5 text-[12px] leading-[1.4]">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            setCategory("Personalizado");
            setProductName("");
            setStep("product");
          }}
          className="mt-4 flex w-full items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition hover:border-neutral-300"
        >
          <div>
            <p className="text-[14px] font-semibold text-neutral-900">
              Seu negócio não está aqui?
            </p>

            <p className="mt-1 text-[12px] text-neutral-400">
              Escolha uma opção personalizada e continue.
            </p>
          </div>

          <ArrowRight size={17} className="text-neutral-500" />
        </button>
      </>
    );
  }

  function renderProduct() {
    const suggestions = productSuggestions[category] ?? [];

    return (
      <>
        <p className="mb-6 text-[15px] leading-6 text-neutral-500">
          Escolha um produto ou digite o nome que você vende.
        </p>

        <label className="mb-2 block text-[13px] font-medium text-neutral-700">
          Nome do produto
        </label>

        <input
          value={productName}
          onChange={(event) => setProductName(event.target.value)}
          placeholder="Ex.: Açaí 500ml"
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-[15px] outline-none transition focus:border-neutral-400"
        />

        {suggestions.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-[13px] font-medium text-neutral-500">
              Sugestões
            </p>

            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setProductName(suggestion)}
                  className="rounded-full border border-neutral-200 bg-white px-3.5 py-2 text-[13px] text-neutral-700 transition hover:border-neutral-400"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <PrimaryButton
          onClick={() => {
            if (!productName.trim()) {
              setError("Digite o nome do produto.");
              return;
            }

            setError("");
            setStep("ingredients");
          }}
        >
          Continuar
          <ArrowRight size={17} />
        </PrimaryButton>
      </>
    );
  }

  function renderIngredientForm() {
    return (
      <>
        <p className="mb-6 text-[15px] leading-6 text-neutral-500">
          Informe quanto você pagou, quanto comprou e quanto usa na receita.
        </p>

        <Field label="Qual é o ingrediente?">
          <input
            value={ingredient.name}
            onChange={(event) =>
              setIngredient((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            placeholder="Ex.: Açaí"
            className={inputClass}
          />
        </Field>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="mb-3 text-[13px] font-semibold text-neutral-700">
            Como você comprou?
          </p>

          <p className="mb-4 text-[12px] leading-5 text-neutral-400">
            Isso permite calcular ingredientes vendidos em baldes, pacotes,
            caixas, fardos e outros.
          </p>

          <div className="grid grid-cols-[1fr_120px] gap-2">
            <NumberInput
              value={ingredient.packages}
              onChange={(value) =>
                setIngredient((current) => ({
                  ...current,
                  packages: value,
                }))
              }
            />

            <Select
              value="un"
              onChange={() => undefined}
              options={[
                ["un", "unidade"],
              ]}
            />
          </div>

          <p className="mb-2 mt-4 text-[12px] font-medium text-neutral-500">
            Quanto vem em cada embalagem?
          </p>

          <div className="grid grid-cols-[1fr_120px] gap-2">
            <NumberInput
              value={ingredient.quantityPerPackage}
              onChange={(value) =>
                setIngredient((current) => ({
                  ...current,
                  quantityPerPackage: value,
                }))
              }
            />

            <Select
              value={ingredient.purchaseUnit}
              onChange={(value) =>
                setIngredient((current) => ({
                  ...current,
                  purchaseUnit: value as Unit,
                }))
              }
              options={[
                ["kg", "kg"],
                ["g", "g"],
                ["mg", "mg"],
                ["L", "L"],
                ["ml", "ml"],
                ["un", "un"],
                ["duzia", "dúzia"],
              ]}
            />
          </div>
        </div>

        <Field label="Quanto você pagou?">
          <MoneyInput
            value={ingredient.price}
            onChange={(value) =>
              setIngredient((current) => ({
                ...current,
                price: value,
              }))
            }
          />
        </Field>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="mb-3 text-[13px] font-semibold text-neutral-700">
            Quanto você usa nessa receita?
          </p>

          <div className="grid grid-cols-[1fr_120px] gap-2">
            <NumberInput
              value={ingredient.usedQuantity}
              onChange={(value) =>
                setIngredient((current) => ({
                  ...current,
                  usedQuantity: value,
                }))
              }
            />

            <Select
              value={ingredient.usedUnit}
              onChange={(value) =>
                setIngredient((current) => ({
                  ...current,
                  usedUnit: value as Unit,
                }))
              }
              options={[
                ["kg", "kg"],
                ["g", "g"],
                ["mg", "mg"],
                ["L", "L"],
                ["ml", "ml"],
                ["un", "un"],
                ["duzia", "dúzia"],
              ]}
            />
          </div>

          {ingredient.name &&
            ingredient.price > 0 &&
            ingredient.usedQuantity > 0 &&
            canConvert(ingredient.purchaseUnit, ingredient.usedUnit) && (
              <div className="mt-4 rounded-xl bg-neutral-50 p-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-neutral-400">
                  Prévia
                </p>

                <p className="mt-1 text-[13px] text-neutral-600">
                  Custo usado na receita:{" "}
                  <strong className="text-neutral-900">
                    {formatCurrency(calculateIngredientCost(ingredient))}
                  </strong>
                </p>
              </div>
            )}
        </div>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <button
          onClick={addIngredient}
          className="custai-primary mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F6B50] px-4 py-4 text-[14px] font-semibold text-white transition hover:bg-[#0B5A43] active:scale-[0.99]"
        >
          {editingIngredientId ? (
            <>
              <Check size={17} />
              Salvar alteração
            </>
          ) : (
            <>
              <Plus size={17} />
              Adicionar ingrediente
            </>
          )}
        </button>
      </>
    );
  }

  function renderIngredients() {
    return (
      <>
        <p className="mb-6 text-[15px] leading-6 text-neutral-500">
          Adicione todos os ingredientes usados para fazer{" "}
          <strong className="text-neutral-700">{productName}</strong>.
        </p>

        {ingredients.length > 0 && (
          <div className="mb-5 space-y-2">
            {ingredients.map((item) => {
              const cost = calculateIngredientCost(item);

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-neutral-900">
                      {item.name}
                    </p>

                    <p className="mt-1 text-[12px] text-neutral-400">
                      Usa {formatNumber(item.usedQuantity)} {item.usedUnit}
                    </p>
                  </div>

                  <div className="ml-3 flex shrink-0 items-center gap-2">
                    <strong className="text-[14px] text-neutral-900">
                      {formatCurrency(cost)}
                    </strong>

                    <button
                      onClick={() => editIngredient(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600"
                    >
                      <Edit3 size={14} />
                    </button>

                    <button
                      onClick={() => deleteIngredient(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {renderIngredientForm()}

        <button
          onClick={continueFromIngredients}
          className="custai-primary mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F6B50] px-4 py-4 text-[14px] font-semibold text-white transition hover:bg-[#0B5A43] active:scale-[0.99]"
        >
          Continuar
          <ArrowRight size={17} />
        </button>
      </>
    );
  }

  function renderYield() {
    return (
      <>
        <p className="mb-6 text-[15px] leading-6 text-neutral-500">
          Primeiro, diga quanto a receita produz. Depois, informe o tamanho em que você vende.
        </p>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="mb-1 text-[13px] font-semibold text-neutral-700">
            Quanto essa receita rende?
          </p>
          <p className="mb-3 text-[12px] text-neutral-400">
            Ex.: 2 kg de recheio, 10 L de açaí ou 50 unidades.
          </p>

          <div className="grid grid-cols-[1fr_130px] gap-2">
            <NumberInput value={yieldQuantity} onChange={setYieldQuantity} />
            <Select
              value={yieldUnit}
              onChange={(value) => {
                const nextUnit = value as Unit;
                setYieldUnit(nextUnit);
                setSaleUnit((current) =>
                  canConvert(nextUnit, current) ? current : nextUnit,
                );
              }}
              options={[
                ["un", "unidades"],
                ["duzia", "dúzias"],
                ["g", "g"],
                ["kg", "kg"],
                ["ml", "ml"],
                ["L", "L"],
              ]}
            />
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="mb-1 text-[13px] font-semibold text-neutral-700">
            Como você vende?
          </p>
          <p className="mb-3 text-[12px] text-neutral-400">
            Ex.: por kg, por 300 ml, por fatia ou por unidade.
          </p>

          <div className="grid grid-cols-[1fr_130px] gap-2">
            <NumberInput value={saleQuantity} onChange={setSaleQuantity} />
            <Select
              value={saleUnit}
              onChange={(value) => setSaleUnit(value as Unit)}
              options={[
                ["un", "unidade"],
                ["duzia", "dúzia"],
                ["g", "g"],
                ["kg", "kg"],
                ["ml", "ml"],
                ["L", "L"],
              ]}
            />
          </div>

          {saleQuantity > 0 && yieldQuantity > 0 && canConvert(yieldUnit, saleUnit) && (
            <div className="mt-4 rounded-xl bg-neutral-50 p-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-neutral-400">
                Prévia
              </p>
              <p className="mt-1 text-[13px] text-neutral-600">
                Essa receita rende aproximadamente{" "}
                <strong className="text-neutral-900">
                  {formatNumber(saleUnitsPerBatch)} {formatUnitLabel(saleUnit)}
                  {saleUnitsPerBatch === 1 ? "" : "s"}
                </strong>.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 rounded-2xl bg-neutral-50 p-4">
          <p className="text-[12px] uppercase tracking-[0.06em] text-neutral-400">
            Custo atual
          </p>

          <p className="mt-1 text-[24px] font-semibold tracking-[-0.03em] text-neutral-900">
            {formatCurrency(totalCost)}
          </p>

          <p className="mt-1 text-[13px] text-neutral-500">
            {formatCurrency(costPerUnit)} por {formatUnitLabel(saleUnit)}
          </p>
        </div>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <PrimaryButton onClick={continueFromYield}>
          Continuar
          <ArrowRight size={17} />
        </PrimaryButton>
      </>
    );
  }

  function renderExtras() {
    return (
      <>
        <p className="mb-6 text-[15px] leading-6 text-neutral-500">
          Só coloque aqui aquilo que realmente faz sentido para esse produto.
        </p>

        <Field label="Custo da embalagem">
          <MoneyInput
            value={packagingCost}
            onChange={setPackagingCost}
          />
        </Field>

        <div className="mt-3 rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-[14px] font-semibold text-neutral-900">
            Esse valor é de quê?
          </p>
          <p className="mt-1 text-[12px] leading-5 text-neutral-400">
            Assim o custo da embalagem é distribuído do jeito certo.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              ["batch", "Da receita inteira"],
              ["unit", "De cada unidade"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setPackagingMode(value as PackagingMode)}
                className={`rounded-xl border px-3 py-3 text-left text-[13px] font-medium transition ${
                  packagingMode === value
                    ? "border-[#0F6B50] bg-[#EDF4F0] text-[#0F6B50]"
                    : "border-neutral-200 bg-white text-neutral-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="mt-3 text-[12px] leading-5 text-neutral-400">
            {packagingMode === "unit"
              ? `O cálculo considera ${formatNumber(saleUnitsPerBatch)} embalagens por receita.`
              : "O valor informado será considerado para toda a receita."}
          </p>
        </div>

        <Field label="Outros custos dessa receita">
          <MoneyInput
            value={otherCosts}
            onChange={setOtherCosts}
          />
          <p className="mt-2 text-[12px] leading-5 text-neutral-400">
            Ex.: decoração, gás, cobertura extra ou outro custo variável.
          </p>
        </Field>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <button
            onClick={() => setShowAdvanced((value) => !value)}
            className="flex w-full items-center justify-between text-left"
          >
            <div>
              <p className="text-[14px] font-semibold text-neutral-900">
                Opções avançadas
              </p>
              <p className="mt-1 text-[12px] text-neutral-400">
                Mão de obra e perdas
              </p>
            </div>

            {showAdvanced ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {showAdvanced && (
            <div className="mt-5 border-t border-neutral-100 pt-5">
              <label className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-medium text-neutral-800">
                    Considerar sua mão de obra
                  </p>
                  <p className="mt-1 text-[12px] text-neutral-400">
                    Quanto vale sua hora × tempo de trabalho
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={includeLabor}
                  onChange={(event) =>
                    setIncludeLabor(event.target.checked)
                  }
                  className="h-5 w-5"
                />
              </label>

              {includeLabor && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Field label="Quanto vale sua hora?">
                    <MoneyInput
                      value={hourlyValue}
                      onChange={setHourlyValue}
                    />
                  </Field>

                  <Field label="Horas de trabalho">
                    <NumberInput
                      value={activeHours}
                      onChange={setActiveHours}
                    />
                  </Field>
                </div>
              )}

              <Field label="Perdas (%)">
                <NumberInput
                  value={wastePercent}
                  onChange={setWastePercent}
                />
                <p className="mt-2 text-[12px] text-neutral-400">
                  Use somente se a receita realmente tiver perda.
                </p>
              </Field>
            </div>
          )}
        </div>

        <div className="mt-4 rounded-2xl bg-neutral-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-neutral-500">
              Custo total
            </span>
            <strong className="text-[15px] text-neutral-900">
              {formatCurrency(totalCost)}
            </strong>
          </div>
        </div>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <PrimaryButton onClick={continueFromExtras}>
          Continuar
          <ArrowRight size={17} />
        </PrimaryButton>
      </>
    );
  }

  function renderMargin() {
    const selectedMargin = margin === -1 ? customMargin : margin;

    return (
      <>
        <div className="mb-7">
          <p className="mb-2 text-[13px] font-medium uppercase tracking-[0.08em] text-[#0D6B52]">
            Margem
          </p>

          <h2 className="text-[30px] font-semibold leading-tight tracking-[-0.03em] text-[#101814]">
            Quanto você quer ganhar?
          </h2>

          <p className="mt-3 max-w-md text-[15px] leading-6 text-[#68736D]">
            Escolha quanto do preço final deve ficar depois de pagar os custos
            do produto.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {marginSuggestions.map((item) => {
            const selected = margin === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setMargin(item.value)}
                className={`rounded-2xl border p-4 text-left transition ${
                  selected
                    ? "border-[#0D6B52] bg-[#0D6B52] text-white"
                    : "border-[#DFE4E0] bg-white text-[#101814] hover:border-[#0D6B52]"
                }`}
              >
                <p className="text-[22px] font-semibold">{item.label}</p>

                <p
                  className={`mt-1 text-[12px] ${
                    selected ? "text-white/75" : "text-[#68736D]"
                  }`}
                >
                  {item.value === 30
                    ? "mais conservadora"
                    : item.value === 40
                      ? "equilibrada"
                      : item.value === 50
                        ? "maior retorno"
                        : "margem alta"}
                </p>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setMargin(-1)}
          className={`mt-3 flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
            margin === -1
              ? "border-[#0D6B52] bg-[#EDF4F0]"
              : "border-[#DFE4E0] bg-white"
          }`}
        >
          <div>
            <p className="text-[15px] font-medium text-[#101814]">
              Quero escolher outra
            </p>
            <p className="mt-1 text-[12px] text-[#68736D]">
              Defina sua própria margem
            </p>
          </div>

          <span className="text-[14px] font-semibold text-[#0D6B52]">
            {margin === -1 ? `${customMargin}%` : "Personalizar"}
          </span>
        </button>

        {margin === -1 && (
          <div className="mt-3 rounded-2xl border border-[#DFE4E0] bg-white p-4">
            <label className="mb-2 block text-[13px] font-medium text-[#101814]">
              Sua margem
            </label>

            <div className="relative">
              <NumberInput
                value={customMargin}
                onChange={setCustomMargin}
              />

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[15px] font-medium text-[#68736D]">
                %
              </span>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-3xl bg-[#EDF4F0] p-5">
          <p className="text-[13px] font-medium text-[#68736D]">
            Com margem de {selectedMargin}%
          </p>

          <p className="mt-2 text-[30px] font-semibold tracking-[-0.03em] text-[#101814]">
            {formatCurrency(directPrice)}
          </p>

          <p className="mt-1 text-[13px] leading-5 text-[#68736D]">
            Este é o preço antes das taxas de entrega ou outros canais de venda.
          </p>
        </div>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <div className="mt-6">
          <PrimaryButton onClick={continueFromMargin}>
            Continuar
            <ArrowRight size={17} />
          </PrimaryButton>
        </div>
      </>
    );
  }

  function renderChannel() {
    const displayedChannelName =
      channel.id === "custom" ? customChannelName : channel.name;

    return (
      <>
        <p className="mb-6 text-[15px] leading-6 text-neutral-500">
          Se você vende direto, não precisa adicionar nenhuma taxa.
        </p>

        <div className="space-y-2">
          {channels.map((item) => {
            const selected = channel.id === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setChannel({ ...item })}
                className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                  selected
                    ? "border-neutral-900 bg-[#0F6B50] text-white"
                    : "border-neutral-200 bg-white text-neutral-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      selected
                        ? "bg-white/10"
                        : "bg-neutral-100"
                    }`}
                  >
                    <Store size={17} />
                  </div>

                  <div>
                    <p className="text-[14px] font-semibold">
                      {item.name}
                    </p>

                    {item.id !== "none" && item.id !== "custom" && (
                      <p
                        className={`mt-1 text-[11px] ${
                          selected
                            ? "text-neutral-300"
                            : "text-neutral-400"
                        }`}
                      >
                        Taxas configuráveis
                      </p>
                    )}
                  </div>
                </div>

                {selected && <Check size={18} />}
              </button>
            );
          })}
        </div>

        {channel.id === "custom" && (
          <div className="mt-4">
            <Field label="Nome do canal">
              <input
                value={customChannelName}
                onChange={(event) =>
                  setCustomChannelName(event.target.value)
                }
                className={inputClass}
                placeholder="Ex.: WhatsApp, loja física..."
              />
            </Field>
          </div>
        )}

        {channel.id !== "none" && (
          <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-[14px] font-semibold text-neutral-900">
              Taxas do canal
            </p>

            <p className="mt-1 text-[12px] leading-5 text-neutral-400">
              Você pode ajustar os valores conforme o seu contrato.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Field label="Taxa variável (%)">
                <NumberInput
                  value={channel.variableRate}
                  onChange={(value) =>
                    setChannel((current) => ({
                      ...current,
                      variableRate: value,
                    }))
                  }
                />
              </Field>

              <Field label="Taxa fixa">
                <MoneyInput
                  value={channel.fixedFee}
                  onChange={(value) =>
                    setChannel((current) => ({
                      ...current,
                      fixedFee: value,
                    }))
                  }
                />
              </Field>
            </div>

            <Field label="Margem de segurança (%)">
              <NumberInput
                value={channel.safetyRate}
                onChange={(value) =>
                  setChannel((current) => ({
                    ...current,
                    safetyRate: value,
                  }))
                }
              />

              <p className="mt-2 text-[12px] leading-5 text-neutral-400">
                É uma proteção contra pequenas alterações nas taxas. Não é a
                taxa oficial da plataforma.
              </p>
            </Field>

            <div className="mt-4 border-t border-neutral-100 pt-4">
              <p className="text-[13px] font-semibold text-neutral-800">
                Mensalidade
              </p>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <Field label="Mensalidade">
                  <MoneyInput
                    value={channel.monthlyFee}
                    onChange={(value) =>
                      setChannel((current) => ({
                        ...current,
                        monthlyFee: value,
                      }))
                    }
                  />
                </Field>

                <Field label="Pedidos por mês">
                  <NumberInput
                    value={channel.expectedMonthlyOrders}
                    onChange={(value) =>
                      setChannel((current) => ({
                        ...current,
                        expectedMonthlyOrders: value,
                      }))
                    }
                  />
                </Field>
              </div>

              {channel.monthlyFee > 0 &&
                channel.expectedMonthlyOrders <= 0 && (
                  <p className="mt-2 text-[12px] leading-5 text-neutral-400">
                    A mensalidade não será incluída até você informar uma
                    estimativa de pedidos por mês.
                  </p>
                )}
            </div>

            <div className="mt-4 border-t border-neutral-100 pt-4">
              <label className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-neutral-800">
                    Antecipar recebimento
                  </p>

                  <p className="mt-1 text-[11px] text-neutral-400">
                    Inclui a taxa de antecipação no cálculo.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={channel.useAnticipation}
                  onChange={(event) =>
                    setChannel((current) => ({
                      ...current,
                      useAnticipation: event.target.checked,
                    }))
                  }
                  className="h-5 w-5"
                />
              </label>

              {channel.useAnticipation && (
                <div className="mt-3">
                  <Field label="Taxa de antecipação (%)">
                    <NumberInput
                      value={channel.anticipationRate}
                      onChange={(value) =>
                        setChannel((current) => ({
                          ...current,
                          anticipationRate: value,
                        }))
                      }
                    />
                  </Field>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-xl bg-neutral-50 p-3">
              <p className="text-[11px] uppercase tracking-[0.06em] text-neutral-400">
                Taxa usada no cálculo
              </p>

              <p className="mt-1 text-[15px] font-semibold text-neutral-900">
                {effectiveVariableRate.toFixed(2).replace(".", ",")}%
              </p>
            </div>
          </div>
        )}

        <div className="mt-5 rounded-2xl bg-neutral-50 p-4">
          <p className="text-[12px] uppercase tracking-[0.06em] text-neutral-400">
            Preço para {displayedChannelName}
          </p>

          <p className="mt-1 text-[28px] font-semibold tracking-[-0.03em] text-neutral-900">
            {formatCurrency(finalExactPrice)}
          </p>
        </div>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <PrimaryButton onClick={continueFromChannel}>
          Ver resultado
          <ArrowRight size={17} />
        </PrimaryButton>
      </>
    );
  }

  function renderResult() {
    const displayedChannelName =
      channel.id === "custom" ? customChannelName : channel.name;

    const comparisonDifference = recommendedPrice - currentPrice;
    const comparisonLabel =
      comparisonDifference > 0
        ? "O preço recomendado fica acima do seu preço atual."
        : comparisonDifference < 0
          ? "O preço recomendado fica abaixo do seu preço atual."
          : "O preço recomendado é igual ao seu preço atual.";

    const estimatedNetAtCurrentPrice =
      channel.id === "none"
        ? currentPrice
        : Math.max(
            0,
            (currentPrice - channel.fixedFee - monthlyFeePerOrder) *
              platformRetention *
              anticipationRetention,
          );

    const profitAtCurrentPrice = estimatedNetAtCurrentPrice - costPerUnit;

    const marginAtCurrentPrice =
      estimatedNetAtCurrentPrice > 0
        ? (profitAtCurrentPrice / estimatedNetAtCurrentPrice) * 100
        : 0;

    const profitDifference =
      currentPrice > 0
        ? actualProfitAtRecommended - profitAtCurrentPrice
        : 0;

    return (
      <>
        <div className="rounded-3xl bg-[#0F6B50] p-6 text-white shadow-[0_10px_30px_rgba(15,107,80,0.14)]">
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-white/65">
            Preço recomendado
          </p>
          <p className="mt-2 text-[44px] font-semibold leading-none tracking-[-0.045em]">
            {formatCurrency(recommendedPrice)}
          </p>
          <p className="mt-3 text-[13px] leading-5 text-white/75">
            Para vender {productName} {channel.id === "none" ? "direto" : `por ${displayedChannelName}`}.
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-[13px] font-semibold text-neutral-900">
            O que esse preço deixa para você
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <SummaryCard title="Custo" value={formatCurrency(costPerUnit)} />
            <SummaryCard title="Sobra por venda" value={formatCurrency(actualProfitAtRecommended)} />
            <SummaryCard title="Você recebe" value={formatCurrency(estimatedNetRevenue)} />
            <SummaryCard
              title="Margem real"
              value={`${actualNetMarginAtRecommended.toFixed(1).replace(".", ",")}%`}
            />
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-neutral-500">Margem desejada</span>
            <strong className="text-[14px] text-neutral-900">{marginValue.toFixed(0)}%</strong>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[13px] text-neutral-500">Margem no preço recomendado</span>
            <strong className="text-[14px] text-neutral-900">
              {actualNetMarginAtRecommended.toFixed(1).replace(".", ",")} %
            </strong>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[13px] text-neutral-500">Preço antes do arredondamento</span>
            <strong className="text-[14px] text-neutral-900">{formatCurrency(finalExactPrice)}</strong>
          </div>
        </div>

        {channel.id !== "none" && (
          <div className="mt-3 rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-[13px] font-semibold text-neutral-900">O canal de venda</p>
            <p className="mt-1 text-[12px] leading-5 text-neutral-400">
              As taxas informadas já foram consideradas no preço recomendado.
            </p>
            <div className="mt-4 space-y-2.5">
              <DetailRow label="Taxa usada no cálculo" value={`${effectiveVariableRate.toFixed(2).replace(".", ",")}%`} />
              <DetailRow label="Taxa fixa por venda" value={formatCurrency(channel.fixedFee)} />
              {monthlyFeePerOrder > 0 && (
                <DetailRow label="Mensalidade por pedido" value={formatCurrency(monthlyFeePerOrder)} />
              )}
            </div>
          </div>
        )}

        {currentPrice > 0 && (
          <div className="mt-3 rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-[13px] font-semibold text-neutral-900">Comparando com seu preço atual</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <SummaryCard title="Você cobra hoje" value={formatCurrency(currentPrice)} />
              <SummaryCard title="Você recebe" value={formatCurrency(estimatedNetAtCurrentPrice)} />
              <SummaryCard title="Sobra por venda" value={formatCurrency(profitAtCurrentPrice)} />
              <SummaryCard
                title="Margem real"
                value={`${marginAtCurrentPrice.toFixed(1).replace(".", ",")}%`}
              />
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-neutral-500">Diferença para o recomendado</span>
                <strong className="text-[14px] text-neutral-900">
                  {comparisonDifference > 0 ? "+" : ""}{formatCurrency(comparisonDifference)}
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[13px] text-neutral-500">Diferença na sobra por venda</span>
                <strong className="text-[14px] text-neutral-900">
                  {profitDifference > 0 ? "+" : ""}{formatCurrency(profitDifference)}
                </strong>
              </div>
            </div>

            <p className="mt-3 text-[12px] leading-5 text-neutral-400">{comparisonLabel}</p>
          </div>
        )}

        <div className="mt-3 rounded-2xl border border-neutral-200 bg-white">
          <button
            onClick={() => setShowPlanning((value) => !value)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div>
              <p className="text-[14px] font-semibold text-neutral-900">Planejar suas vendas</p>
              <p className="mt-1 text-[12px] text-neutral-400">Veja quanto precisa vender para chegar a uma meta.</p>
            </div>
            {showPlanning ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showPlanning && (
            <div className="border-t border-neutral-100 p-4">
              <Field label="Quanto você quer lucrar por mês?">
                <MoneyInput
                  value={monthlyProfitTarget}
                  onChange={setMonthlyProfitTarget}
                />
              </Field>

              {monthlyProfitTarget > 0 && actualProfitAtRecommended > 0 ? (
                <div className="rounded-2xl bg-[#F7FAF8] p-4">
                  <p className="text-[12px] uppercase tracking-[0.06em] text-neutral-400">
                    Para atingir sua meta
                  </p>
                  <p className="mt-1 text-[26px] font-semibold tracking-[-0.03em] text-neutral-900">
                    {recommendedMonthlyUnits} vendas por mês
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <SummaryCard
                      title="Por semana"
                      value={String(recommendedWeeklyUnits)}
                    />
                    <SummaryCard
                      title="Por dia"
                      value={String(recommendedDailyUnits)}
                    />
                  </div>
                  <p className="mt-3 text-[12px] leading-5 text-neutral-400">
                    Estimativa usando o lucro líquido de {formatCurrency(actualProfitAtRecommended)} por venda no preço recomendado.
                  </p>
                </div>
              ) : (
                <p className="rounded-xl bg-neutral-50 p-3 text-[12px] leading-5 text-neutral-400">
                  Informe uma meta acima de zero. Se o lucro por venda não for positivo, revise o preço, os custos ou a margem.
                </p>
              )}

              <div className="mt-5 border-t border-neutral-100 pt-5">
                <Field label="E se eu vender por outro preço?">
                  <MoneyInput
                    value={simulationPrice}
                    onChange={setSimulationPrice}
                  />
                </Field>

                {simulationPrice > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    <SummaryCard
                      title="Sobra por venda"
                      value={formatCurrency(simulationProfit)}
                    />
                    <SummaryCard
                      title="Margem líquida"
                      value={`${simulationMargin.toFixed(1).replace(".", ",")}%`}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 rounded-2xl border border-neutral-200 bg-white">
          <button
            onClick={() => setShowDetails((value) => !value)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div>
              <p className="text-[14px] font-semibold text-neutral-900">Ver detalhes do cálculo</p>
              <p className="mt-1 text-[12px] text-neutral-400">Veja de onde saiu o preço.</p>
            </div>
            {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showDetails && (
            <div className="border-t border-neutral-100 p-4">
              <DetailRow label="Ingredientes" value={formatCurrency(ingredientTotal)} />
              <DetailRow
                label="Embalagem"
                value={formatCurrency(packagingCostForBatch)}
              />
              <p className="mt-1 text-[11px] leading-4 text-neutral-400">
                {packagingMode === "unit"
                  ? "Valor calculado para as embalagens de cada unidade."
                  : "Valor informado para a receita inteira."}
              </p>
              <DetailRow label="Outros custos" value={formatCurrency(otherCosts)} />
              <DetailRow label="Mão de obra" value={formatCurrency(laborCost)} />
              <DetailRow label={`Perdas (${wastePercent}%)`} value={formatCurrency(ingredientCostWithWaste - ingredientTotal)} />
              <div className="my-3 border-t border-neutral-100" />
              <DetailRow label="Custo total da receita" value={formatCurrency(totalCost)} strong />
              <DetailRow label="Rendimento da receita" value={`${formatNumber(yieldQuantity)} ${formatUnitLabel(yieldUnit)}`} />
              <DetailRow label="Venda por" value={`${formatNumber(saleQuantity)} ${formatUnitLabel(saleUnit)}`} />
              <DetailRow label="Unidades de venda por receita" value={formatNumber(saleUnitsPerBatch)} />
              <DetailRow label={`Custo por ${formatUnitLabel(saleUnit)}`} value={formatCurrency(costPerUnit)} strong />
              {channel.id !== "none" && (
                <>
                  <div className="my-3 border-t border-neutral-100" />
                  <DetailRow label="Taxa de referência" value={`${channel.variableRate.toFixed(2).replace(".", ",")}%`} />
                  <DetailRow label="Margem de segurança" value={`+${channel.safetyRate.toFixed(2).replace(".", ",")}%`} />
                  {channel.useAnticipation && (
                    <DetailRow label="Antecipação" value={`${channel.anticipationRate.toFixed(2).replace(".", ",")}%`} />
                  )}
                  {monthlyFeePerOrder > 0 && (
                    <DetailRow label="Mensalidade por pedido" value={formatCurrency(monthlyFeePerOrder)} />
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4">
          <Field label="Seu preço atual (opcional)">
            <MoneyInput value={currentPrice} onChange={setCurrentPrice} />
          </Field>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-[13px] font-semibold text-neutral-900">Arredondamento comercial</p>
          <p className="mt-1 text-[12px] leading-5 text-neutral-400">Escolha como o preço calculado deve aparecer para o cliente.</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              ["exact", "Exato"],
              ["0.50", "Próximo 0,50"],
              ["0.90", "Próximo 0,90"],
              ["1.00", "Próximo R$ 1"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setCommercialRounding(value)}
                className={`rounded-xl border px-3 py-3 text-[12px] font-medium ${
                  commercialRounding === value
                    ? "border-neutral-900 bg-[#0F6B50] text-white"
                    : "border-neutral-200 bg-white text-neutral-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={saveProduct}
          className="custai-save mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-[14px] font-semibold transition"
        >
          <Save size={17} />
          {editingProductId ? "Atualizar produto" : "Salvar este produto"}
        </button>

        <button
          onClick={resetCalculation}
          className="custai-secondary mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-[14px] font-semibold text-neutral-800 transition hover:border-neutral-300"
        >
          <RotateCcw size={17} />
          Fazer novo cálculo
        </button>

        <div className="mt-5 rounded-2xl border border-neutral-200 bg-[#F7FAF8] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F6B50] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <Save size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-neutral-900">Seus dados ficam neste aparelho</p>
              <p className="mt-1 text-[12px] leading-5 text-neutral-500">
                Faça um backup para não perder seus produtos se trocar de celular, navegador ou limpar os dados.
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={exportData}
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-3 text-[12px] font-medium text-neutral-700 transition hover:border-neutral-300 active:scale-[0.99]"
            >
              <Download size={15} />
              Fazer backup
            </button>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-3 text-[12px] font-medium text-neutral-700 transition hover:border-neutral-300 active:scale-[0.99]">
              <Upload size={15} />
              Restaurar backup
              <input
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) importData(file);
                  event.currentTarget.value = "";
                }}
              />
            </label>
          </div>
        </div>

        {savedProducts.length > 0 && (
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[17px] font-semibold text-neutral-900">Produtos salvos</h2>
              <span className="text-[12px] text-neutral-400">{savedProducts.length}</span>
            </div>
            <div className="space-y-2">
              {savedProducts.map((product) => (
                <div key={product.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <button onClick={() => loadProduct(product)} className="min-w-0 text-left">
                      <p className="truncate text-[14px] font-semibold text-neutral-900">{product.name}</p>
                      <p className="mt-1 text-[12px] text-neutral-400">{product.category}</p>
                    </button>
                    <button
                      onClick={() => loadProduct(product)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600"
                      aria-label={`Editar ${product.name}`}
                      title="Editar"
                    >
                      <Edit3 size={14} />
                    </button>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => duplicateProduct(product)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 py-2.5 text-[12px] font-medium text-neutral-700 transition hover:border-neutral-300"
                    >
                      <Plus size={14} />
                      Duplicar
                    </button>
                    <button
                      onClick={() => {
                        if (editingProductId === product.id) setEditingProductId(null);
                        setSavedProducts((current) => current.filter((item) => item.id !== product.id));
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 py-2.5 text-[12px] font-medium text-neutral-600 transition hover:border-neutral-300"
                    >
                      <Trash2 size={14} />
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <main className="custai-app min-h-screen bg-[#F7F7F4]">
      <div className="custai-shell mx-auto min-h-screen w-full max-w-xl px-5 pb-12 pt-6 sm:px-8">
        {renderHeader()}

        {step === "quickDelivery" && renderQuickDelivery()}
        {step === "category" && renderCategory()}
        {step === "product" && renderProduct()}
        {step === "ingredients" && renderIngredients()}
        {step === "yield" && renderYield()}
        {step === "extras" && renderExtras()}
        {step === "margin" && renderMargin()}
        {step === "channel" && renderChannel()}
        {step === "result" && renderResult()}

        {step !== "category" && (
          <p className="mt-8 text-center text-[11px] leading-5 text-neutral-400">
            Seus dados ficam salvos neste dispositivo.
          </p>
        )}
      </div>

      <style>{`
        .custai-app {
          color: #111714;
          -webkit-font-smoothing: antialiased;
        }
        .custai-shell {
          max-width: 680px;
        }
        .custai-app button,
        .custai-app input,
        .custai-app select {
          -webkit-tap-highlight-color: transparent;
        }
        .custai-app button {
          outline: none;
        }
        .custai-app button:focus-visible,
        .custai-app input:focus-visible,
        .custai-app select:focus-visible {
          outline: 3px solid rgba(15,107,80,.14);
          outline-offset: 2px;
        }
        .custai-app header .custai-brand-mark {
          box-shadow: 0 8px 22px rgba(15,107,80,.14);
        }
        .custai-app .custai-brand-name {
          letter-spacing: -.03em;
        }
        .custai-app .custai-title {
          font-size: clamp(30px, 7vw, 42px);
          line-height: .99;
          letter-spacing: -.055em;
          font-weight: 750;
        }
        .custai-app .custai-description {
          color: #68736e;
          font-size: 15px;
          line-height: 1.65;
        }
        .custai-app .custai-eyebrow {
          color: #0F6B50;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .13em;
          text-transform: uppercase;
        }
        .custai-app .custai-category-icon {
          background: #EEF5F1;
          color: #0F6B50;
        }
        .custai-app .custai-category-description {
          color: #8A938F;
        }
        .custai-app .custai-primary {
          min-height: 54px;
          border: 1px solid #0F6B50;
          box-shadow: 0 8px 22px rgba(15,107,80,.16);
        }
        .custai-app .custai-option-selected {
          border-color: #0F6B50 !important;
          background: #0F6B50 !important;
          color: #FFFFFF !important;
          box-shadow: 0 8px 22px rgba(15,107,80,.12);
        }
        .custai-app .custai-option-selected .custai-option-icon {
          background: rgba(255,255,255,.12) !important;
          color: #FFFFFF !important;
        }
        .custai-app .custai-option-selected .custai-option-description {
          color: rgba(255,255,255,.70) !important;
        }
        .custai-app .custai-secondary {
          min-height: 52px;
        }
        .custai-app input,
        .custai-app select {
          min-height: 52px;
          border-color: #DDE3DF;
          box-shadow: 0 1px 2px rgba(17,23,20,.025);
        }
        .custai-app input::placeholder {
          color: #A5ADA9;
        }
        .custai-app input:focus,
        .custai-app select:focus {
          border-color: #0F6B50 !important;
          box-shadow: 0 0 0 4px rgba(15,107,80,.09);
        }
        .custai-app .rounded-2xl.border-neutral-200.bg-white {
          border-color: #E0E5E2;
          box-shadow: 0 1px 2px rgba(17,23,20,.025);
        }
        .custai-app .rounded-2xl.border-neutral-200.bg-white:hover {
          border-color: #D3DAD6;
        }
        .custai-app .bg-\[\#F3F8F5\] {
          box-shadow: 0 10px 28px rgba(15,107,80,.07);
        }
        .custai-app button.bg-\[\#0F6B50\],
        .custai-app button[class*="bg-neutral-900"][class*="text-white"] {
          background: #0F6B50 !important;
          border-color: #0F6B50 !important;
          box-shadow: 0 8px 24px rgba(15,107,80,.15);
        }
        .custai-app button[class*="bg-neutral-900"][class*="text-white"] p,
        .custai-app button[class*="bg-neutral-900"][class*="text-white"] span {
          color: inherit;
        }
        .custai-app button[class*="bg-neutral-900"][class*="text-white"] p.mt-1 {
          color: rgba(255,255,255,.68) !important;
        }
        .custai-app .custai-save {
          min-height: 52px;
          background: #0F6B50;
          color: white;
          border-color: #0F6B50;
          box-shadow: 0 8px 22px rgba(15,107,80,.14);
        }
        .custai-app .custai-save:hover {
          background: #0B5A43;
        }
        .custai-app button {
          transition: transform .16s ease, border-color .16s ease, background-color .16s ease, box-shadow .16s ease;
        }
        .custai-app button:active {
          transform: scale(.985);
        }
        .custai-app header > button {
          border-radius: 999px;
          padding: 8px 12px 8px 9px;
          color: #68736E;
        }
        .custai-app header > button:hover {
          background: #EEF5F1;
          color: #0F6B50;
        }
        .custai-app .custai-category-icon {
          box-shadow: inset 0 0 0 1px rgba(15,107,80,.035);
        }
        .custai-app .custai-app-card {
          background: white;
          border: 1px solid #E0E5E2;
          border-radius: 20px;
          box-shadow: 0 2px 7px rgba(17,23,20,.025);
        }
        .custai-app .bg-\[\#F7FAF8\] {
          background: #F1F7F4 !important;
          border: 1px solid #DCEBE4;
        }
        .custai-app .custai-brand-mark {
          border-radius: 14px;
        }
        .custai-app .h-1\.5 {
          height: 5px;
          background: #E7ECE9;
        }
        @media (max-width: 640px) {
          .custai-shell {
            padding-left: 18px;
            padding-right: 18px;
          }
          .custai-app .custai-title {
            font-size: 32px;
          }
        }
      `}</style>
    </main>
  );
}

const inputClass =
  "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-[15px] outline-none transition focus:border-neutral-400";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mb-4 block">
      <span className="mb-2 block text-[13px] font-medium text-neutral-700">
        {label}
      </span>

      {children}
    </label>
  );
}

function NumberInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      type="number"
      min="0"
      step="any"
      value={value}
      onChange={(event) => onChange(parseNumber(event.target.value))}
      className={inputClass}
    />
  );
}

function MoneyInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-neutral-400">
        R$
      </span>

      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(event) => onChange(parseNumber(event.target.value))}
        className={`${inputClass} pl-11`}
      />
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-4 text-[14px] outline-none focus:border-neutral-400"
    >
      {options.map(([optionValue, label]) => (
        <option key={optionValue} value={optionValue}>
          {label}
        </option>
      ))}
    </select>
  );
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="custai-primary mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F6B50] px-4 py-4 text-[14px] font-semibold text-white transition hover:bg-[#0B5A43] active:scale-[0.99]"
    >
      {children}
    </button>
  );
}

function ErrorMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-[13px] leading-5 text-red-700">
      {children}
    </div>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-[11px] uppercase tracking-[0.06em] text-neutral-400">
        {title}
      </p>

      <p className="mt-1 text-[18px] font-semibold tracking-[-0.02em] text-neutral-900">
        {value}
      </p>
    </div>
  );
}

function DetailRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className="text-[12px] text-neutral-500">{label}</span>

      <span
        className={`text-[13px] ${
          strong
            ? "font-semibold text-neutral-900"
            : "text-neutral-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default App;