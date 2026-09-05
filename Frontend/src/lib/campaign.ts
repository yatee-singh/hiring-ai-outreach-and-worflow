import { JobCampaign } from "../types/campaign";

const CAMPAIGN_KEY = "campaign";

export const campaignStore = {
  getCampaign(): JobCampaign | null {
    const campaign = localStorage.getItem(CAMPAIGN_KEY);

    if (!campaign) return null;

    return JSON.parse(campaign);
  },

  setCampaign(campaign: JobCampaign) {
    localStorage.setItem(
      CAMPAIGN_KEY,
      JSON.stringify(campaign)
    );

    window.dispatchEvent(
      new Event("campaign-change")
    );
  },

  clearCampaign() {
    localStorage.removeItem(CAMPAIGN_KEY);

    window.dispatchEvent(
      new Event("campaign-change")
    );
  },

  hasCampaign() {
    return !!localStorage.getItem(CAMPAIGN_KEY);
  },
};

