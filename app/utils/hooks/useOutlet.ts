import { useDisclosure } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../contexts/authContext";
import { setCookie, getCookie } from "cookies-next";
import { IOutlet } from "../model/authModel";
import {
  ICompanyIntegration,
  IIntegrationOutlet,
} from "../model/companyIntegrationModel";
import { IOutletProps } from "../model/outletModel";
import { getCompanyIntegrations } from "services/company";
import {
  trackingChooseOutletClicked,
  trackingOutletSelected,
} from "../tracking";
import { OutletSelectedCookies } from "../constants/cookies";
import { getCompanyTodos } from "services/company";
import posthog from "posthog-js";
import { useQuery } from "@tanstack/react-query";

const useOutlet = (): IOutletProps => {
  const [selectedOutlet, setSelectedOuted] = useState<IOutlet | null>(null);

  const [isHasMultiOutlet, setMultiOutlets] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const authProfile = useAuthContext();

  // get company integration with use query
  const {
    data: integrations,
    isLoading: isLoadingIntegration,
    isFetched: isFetchedOutlet,
    refetch: refetchIntegration,
  } = useQuery(
    ["companyIntegration", selectedOutlet?.telegram_chat_id],
    () => getCompanyIntegrations(selectedOutlet?.telegram_chat_id || ""),
    {
      enabled: !!selectedOutlet?.telegram_chat_id,
    }
  );

  // GET COMPANY TODOS WITH USE QUERY
  const {
    data: todo,
    isLoading: isLoadingTodo,
    refetch: refetchTodo,
  } = useQuery(
    ["companyTodos", selectedOutlet?.telegram_chat_id],
    () => getCompanyTodos(selectedOutlet?.telegram_chat_id || ""),
    {
      enabled: !!selectedOutlet?.telegram_chat_id,
    }
  );

  const onSelectedOutlet = (outlet: IOutlet) => {
    setSelectedOuted(outlet);
    onClose();
    trackingOutletSelected(outlet.outlet_name);

    // Save to cookies
    setCookie(OutletSelectedCookies, JSON.stringify(outlet));
  };

  const handleOpenDrawer = () => {
    trackingChooseOutletClicked();
    onOpen();
  };

  useEffect(() => {
    const outletList = authProfile.user?.outlets || [];
    setMultiOutlets(outletList && outletList.length > 1);
    const outletSelected = getCookie(OutletSelectedCookies)?.toString() || "";
    if (outletSelected) {
      const parseJSONOutlet: IOutlet = JSON.parse(outletSelected);
      if (parseJSONOutlet.telegram_chat_id) {
        const outletData = outletList.find(
          (d) => d.telegram_chat_id === parseJSONOutlet.telegram_chat_id
        );

        if (outletData) {
          setSelectedOuted(outletData);
          return;
        }
      }
    }
    const defaultSelected = outletList && outletList[0];
    setSelectedOuted(defaultSelected);
    return;
  }, [authProfile.user?.outlets]);

  useEffect(() => {
    posthog.group("customer", selectedOutlet?.customer_id || "");
  }, [selectedOutlet]);

  const refetchData = () => {
    refetchIntegration();
    refetchTodo();
  };

  return {
    isLoading: isLoadingIntegration && isLoadingTodo,
    isFetched: isFetchedOutlet,
    isOpenDrawer: isOpen,
    onFetchCompanyData: refetchData,
    onOpenDrawer: handleOpenDrawer,
    onCloseDrawer: onClose,
    onSelectedOutlet,
    selectedOutlet,
    integrations: integrations?.integrations || [],
    outletList: authProfile.user?.outlets || [],
    isHasMultiOutlet,
    toDo: todo || null,
  };
};

export default useOutlet;
