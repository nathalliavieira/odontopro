export type PlanDetailsProps = {
    maxServices: number;
};

export type PlansProps = {
    BASIC: PlanDetailsProps;
    PROFESSIONAL: PlanDetailsProps;
}

export const PLANS: PlansProps = {
    BASIC:{
        maxServices: 3,
    },
    PROFESSIONAL:{
        maxServices: 50,
    }
};

export const subscriptionPlans = [
    {
        id: "BASIC",
        name: "Basic",
        description: "Perfect for smaller clinics",
        oldPrice: "€ 97,90",
        price: "€ 27,90",
        features: [
            `Up to ${PLANS["BASIC"].maxServices} services`,
            "Unlimited bookings",
            "Support",
            "Reports"
        ]
    },
    {
        id: "PROFESSIONAL",
        name: "Professional",
        description: "Ideal for large clinics",
        oldPrice: "€ 197,90",
        price: "€ 97,90",
        features: [
            `Up to ${PLANS["PROFESSIONAL"].maxServices} services`,
            "Unlimited bookings",
            "Priority support",
            "Advanced reports"
        ]
    }
]