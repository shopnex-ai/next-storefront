"use client";

import { setShippingMethod } from "@/services/cart";
import { calculatePriceForShippingOption } from "@/services/fulfillment";
import { Radio, RadioGroup } from "@headlessui/react";
import { CheckCircleSolid, Loader } from "@medusajs/icons";
import { Button, clx, Heading, Text } from "@medusajs/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MedusaRadio from "../radio";

import Divider from "../divider";
import ErrorMessage from "./error-message";
import { convertToLocale } from "@/utils/money";

const PICKUP_OPTION_ON = "__PICKUP_ON";
const PICKUP_OPTION_OFF = "__PICKUP_OFF";

type ShippingProps = {
    availableShippingMethods: any[] | null;
    cart: any;
};

function formatAddress(address: any) {
    if (!address) {
        return "";
    }

    let ret = "";

    if (address.address_1) {
        ret += ` ${address.address_1}`;
    }

    if (address.address_2) {
        ret += `, ${address.address_2}`;
    }

    if (address.postal_code) {
        ret += `, ${address.postal_code} ${address.city}`;
    }

    if (address.country_code) {
        ret += `, ${address.country_code.toUpperCase()}`;
    }

    return ret;
}

const Shipping: React.FC<ShippingProps> = ({
    availableShippingMethods,
    cart,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPrices, setIsLoadingPrices] = useState(true);

    const [showPickupOptions, setShowPickupOptions] =
        useState<string>(PICKUP_OPTION_OFF);
    const [calculatedPricesMap, setCalculatedPricesMap] = useState<
        Record<string, number>
    >({});
    const [error, setError] = useState<null | string>(null);
    const [shippingMethodId, setShippingMethodId] = useState<null | string>(
        cart.shipping_methods?.at(-1)?.shipping_option_id || null
    );

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const isOpen = searchParams.get("step") === "delivery";

    const _shippingMethods = availableShippingMethods?.filter(
        (sm) => sm.service_zone?.fulfillment_set?.type !== "pickup"
    );

    const _pickupMethods = availableShippingMethods?.filter(
        (sm) => sm.service_zone?.fulfillment_set?.type === "pickup"
    );

    const hasPickupOptions = !!_pickupMethods?.length;

    useEffect(() => {
        setIsLoadingPrices(true);

        if (_shippingMethods?.length) {
            const promises = _shippingMethods
                .filter((sm) => sm.price_type === "calculated")
                .map((sm) => calculatePriceForShippingOption(sm.id, cart.id));

            if (promises.length) {
                Promise.allSettled(promises)
                    .then((res) => {
                        const pricesMap: Record<string, number> = {};
                        res.filter((r) => r.status === "fulfilled").forEach(
                            (p: any) =>
                                (pricesMap[p.value?.id || ""] = p.value?.amount)
                        );

                        setCalculatedPricesMap(pricesMap);
                        setIsLoadingPrices(false);
                    })
                    .then((data) => {
                        console.log(data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }

        if (_pickupMethods?.find((m) => m.id === shippingMethodId)) {
            setShowPickupOptions(PICKUP_OPTION_ON);
        }
    }, [availableShippingMethods]);

    const handleEdit = () => {
        router.push(pathname + "?step=delivery", { scroll: false });
    };

    const handleSubmit = () => {
        router.push(pathname + "?step=payment", { scroll: false });
    };

    const handleSetShippingMethod = (
        id: string,
        variant: "pickup" | "shipping"
    ) => {
        setError(null);

        if (variant === "pickup") {
            setShowPickupOptions(PICKUP_OPTION_ON);
        } else {
            setShowPickupOptions(PICKUP_OPTION_OFF);
        }

        let currentId: null | string = null;
        setIsLoading(true);
        setShippingMethodId((prev) => {
            currentId = prev;
            return id;
        });

        // setShippingMethod({ cartId: cart.id, shippingMethodId: id })
        //     .then((data) => {
        //         console.log(data);
        //     })
        //     .catch((err) => {
        //         setShippingMethodId(currentId);

        //         setError(err.message);
        //     })
        //     .finally(() => {
        //         setIsLoading(false);
        //     });
    };

    useEffect(() => {
        setError(null);
    }, [isOpen]);

    return (
        <div className="bg-white">
            <div className="flex flex-row items-center justify-between mb-6">
                <Heading
                    className={clx(
                        "flex flex-row text-3xl-regular gap-x-2 items-baseline",
                        {
                            "opacity-50 pointer-events-none select-none":
                                !isOpen && cart.shipping_methods?.length === 0,
                        }
                    )}
                    level="h2"
                >
                    Delivery
                    {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
                        <CheckCircleSolid />
                    )}
                </Heading>
                {!isOpen &&
                    cart?.shipping_address &&
                    cart?.billing_address &&
                    cart?.email && (
                        <Text>
                            <button
                                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                                data-testid="edit-delivery-button"
                                onClick={handleEdit}
                            >
                                Edit
                            </button>
                        </Text>
                    )}
            </div>
            {isOpen ? (
                <>
                    <div className="grid">
                        <div className="flex flex-col">
                            <span className="font-medium txt-medium text-ui-fg-base">
                                Shipping method
                            </span>
                            <span className="mb-4 text-ui-fg-muted txt-medium">
                                How would you like you order delivered
                            </span>
                        </div>
                        <div data-testid="delivery-options-container">
                            <div className="pb-8 md:pt-0 pt-2">
                                {hasPickupOptions && (
                                    <RadioGroup
                                        onChange={(value) => {
                                            const id = _pickupMethods.find(
                                                (option) =>
                                                    !option.insufficient_inventory
                                            )?.id;

                                            if (id) {
                                                handleSetShippingMethod(
                                                    id,
                                                    "pickup"
                                                );
                                            }
                                        }}
                                        value={showPickupOptions}
                                    >
                                        <Radio
                                            className={clx(
                                                "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                                                {
                                                    "border-ui-border-interactive":
                                                        showPickupOptions ===
                                                        PICKUP_OPTION_ON,
                                                }
                                            )}
                                            data-testid="delivery-option-radio"
                                            value={PICKUP_OPTION_ON}
                                        >
                                            <div className="flex items-center gap-x-4">
                                                <MedusaRadio
                                                    checked={
                                                        showPickupOptions ===
                                                        PICKUP_OPTION_ON
                                                    }
                                                />
                                                <span className="text-base-regular">
                                                    Pick up your order
                                                </span>
                                            </div>
                                            <span className="justify-self-end text-ui-fg-base">
                                                -
                                            </span>
                                        </Radio>
                                    </RadioGroup>
                                )}
                                <RadioGroup
                                    onChange={(v: any) =>
                                        handleSetShippingMethod(v, "shipping")
                                    }
                                    value={shippingMethodId}
                                >
                                    {_shippingMethods?.map((option) => {
                                        const isDisabled =
                                            option.price_type ===
                                                "calculated" &&
                                            !isLoadingPrices &&
                                            typeof calculatedPricesMap[
                                                option.id
                                            ] !== "number";

                                        return (
                                            <Radio
                                                className={clx(
                                                    "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                                                    {
                                                        "border-ui-border-interactive":
                                                            option.id ===
                                                            shippingMethodId,
                                                        "hover:shadow-brders-none cursor-not-allowed":
                                                            isDisabled,
                                                    }
                                                )}
                                                data-testid="delivery-option-radio"
                                                disabled={isDisabled}
                                                key={option.id}
                                                value={option.id}
                                            >
                                                <div className="flex items-center gap-x-4">
                                                    <MedusaRadio
                                                        checked={
                                                            option.id ===
                                                            shippingMethodId
                                                        }
                                                    />
                                                    <span className="text-base-regular">
                                                        {option.name}
                                                    </span>
                                                </div>
                                                <span className="justify-self-end text-ui-fg-base">
                                                    {option.price_type ===
                                                    "flat" ? (
                                                        convertToLocale({
                                                            amount: option.amount!,
                                                            currency_code:
                                                                cart?.currency_code,
                                                        })
                                                    ) : calculatedPricesMap[
                                                          option.id
                                                      ] ? (
                                                        convertToLocale({
                                                            amount: calculatedPricesMap[
                                                                option.id
                                                            ],
                                                            currency_code:
                                                                cart?.currency_code,
                                                        })
                                                    ) : isLoadingPrices ? (
                                                        <Loader />
                                                    ) : (
                                                        "-"
                                                    )}
                                                </span>
                                            </Radio>
                                        );
                                    })}
                                </RadioGroup>
                            </div>
                        </div>
                    </div>

                    {showPickupOptions === PICKUP_OPTION_ON && (
                        <div className="grid">
                            <div className="flex flex-col">
                                <span className="font-medium txt-medium text-ui-fg-base">
                                    Store
                                </span>
                                <span className="mb-4 text-ui-fg-muted txt-medium">
                                    Choose a store near you
                                </span>
                            </div>
                            <div data-testid="delivery-options-container">
                                <div className="pb-8 md:pt-0 pt-2">
                                    <RadioGroup
                                        onChange={(v: any) =>
                                            handleSetShippingMethod(v, "pickup")
                                        }
                                        value={shippingMethodId}
                                    >
                                        {_pickupMethods?.map((option) => {
                                            return (
                                                <Radio
                                                    className={clx(
                                                        "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                                                        {
                                                            "border-ui-border-interactive":
                                                                option.id ===
                                                                shippingMethodId,
                                                            "hover:shadow-brders-none cursor-not-allowed":
                                                                option.insufficient_inventory,
                                                        }
                                                    )}
                                                    data-testid="delivery-option-radio"
                                                    disabled={
                                                        option.insufficient_inventory
                                                    }
                                                    key={option.id}
                                                    value={option.id}
                                                >
                                                    <div className="flex items-start gap-x-4">
                                                        <MedusaRadio
                                                            checked={
                                                                option.id ===
                                                                shippingMethodId
                                                            }
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="text-base-regular">
                                                                {option.name}
                                                            </span>
                                                            <span className="text-base-regular text-ui-fg-muted">
                                                                {formatAddress(
                                                                    option
                                                                        .service_zone
                                                                        ?.fulfillment_set
                                                                        ?.location
                                                                        ?.address
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className="justify-self-end text-ui-fg-base">
                                                        {convertToLocale({
                                                            amount: option.amount!,
                                                            currency_code:
                                                                cart?.currency_code,
                                                        })}
                                                    </span>
                                                </Radio>
                                            );
                                        })}
                                    </RadioGroup>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <ErrorMessage
                            data-testid="delivery-option-error-message"
                            error={error}
                        />
                        <Button
                            className="mt"
                            data-testid="submit-delivery-option-button"
                            disabled={!cart.shipping_methods?.[0]}
                            isLoading={isLoading}
                            onClick={handleSubmit}
                            size="large"
                        >
                            Continue to payment
                        </Button>
                    </div>
                </>
            ) : (
                <div>
                    <div className="text-small-regular">
                        {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
                            <div className="flex flex-col w-1/3">
                                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                                    Method
                                </Text>
                                <Text className="txt-medium text-ui-fg-subtle">
                                    {cart.shipping_methods?.at(-1)?.name}{" "}
                                    {convertToLocale({
                                        amount: cart.shipping_methods.at(-1)
                                            ?.amount!,
                                        currency_code: cart?.currency_code,
                                    })}
                                </Text>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <Divider className="mt-8" />
        </div>
    );
};

export default Shipping;
