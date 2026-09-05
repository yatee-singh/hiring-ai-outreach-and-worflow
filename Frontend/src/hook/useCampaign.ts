// hook/useCampaign.ts

import {
    useEffect,
    useState,
  } from "react";
  
  import { campaignStore } from "../lib/campaign";
  
  export function useCampaign() {
    const [campaign, setCampaign] =
      useState(
        campaignStore.getCampaign()
      );
  
    useEffect(() => {
      const handler = () => {
        setCampaign(
          campaignStore.getCampaign()
        );
      };
  
      window.addEventListener(
        "campaign-change",
        handler
      );
  
      return () => {
        window.removeEventListener(
          "campaign-change",
          handler
        );
      };
    }, []);
  
    return {
      campaign,
    };
  }