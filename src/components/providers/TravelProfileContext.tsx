"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { TourFilterTab } from "@/types/travel";

interface TravelProfileContextValue {
  activeTourFilter: TourFilterTab;
  setActiveTourFilter: (tab: TourFilterTab) => void;
  tourSearch: string;
  setTourSearch: (value: string) => void;
  selectedTourTopic: string;
  consultModalOpen: boolean;
  consultModalTour: string | undefined;
  openConsult: (tourTitle?: string) => void;
  closeConsult: () => void;
  selectDestination: (destination: string) => void;
}

const TravelProfileContext = createContext<TravelProfileContextValue | null>(
  null
);

export function TravelProfileProvider({ children }: { children: ReactNode }) {
  const [activeTourFilter, setActiveTourFilter] =
    useState<TourFilterTab>("all");
  const [tourSearch, setTourSearch] = useState("");
  const [selectedTourTopic, setSelectedTourTopic] = useState("");
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [consultModalTour, setConsultModalTour] = useState<string | undefined>(
    undefined
  );

  const openConsult = useCallback((tourTitle?: string) => {
    setConsultModalTour(tourTitle);
    if (tourTitle) {
      setSelectedTourTopic(tourTitle);
    }
    setConsultModalOpen(true);
  }, []);

  const closeConsult = useCallback(() => {
    setConsultModalOpen(false);
  }, []);

  const selectDestination = useCallback((destination: string) => {
    setActiveTourFilter("all");
    setTourSearch(destination);
  }, []);

  const value = useMemo(
    () => ({
      activeTourFilter,
      setActiveTourFilter,
      tourSearch,
      setTourSearch,
      selectedTourTopic,
      consultModalOpen,
      consultModalTour,
      openConsult,
      closeConsult,
      selectDestination,
    }),
    [
      activeTourFilter,
      tourSearch,
      selectedTourTopic,
      consultModalOpen,
      consultModalTour,
      openConsult,
      closeConsult,
      selectDestination,
    ]
  );

  return (
    <TravelProfileContext.Provider value={value}>
      {children}
    </TravelProfileContext.Provider>
  );
}

export function useTravelProfile() {
  const context = useContext(TravelProfileContext);
  if (!context) {
    throw new Error(
      "useTravelProfile must be used within TravelProfileProvider"
    );
  }
  return context;
}
