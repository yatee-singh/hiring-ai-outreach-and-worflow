import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";

import { useCampaign } from "../hook/useCampaign";

interface NavItem {
  label: string;
  path: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const drawerWidth = 260;

export default function CampaignLayout(): JSX.Element {
  const navigate = useNavigate();

  const { campaignId } = useParams<{
    campaignId: string;
  }>();

  const campaign = useCampaign();

  const sections: NavSection[] = [
    {
      title: "Campaign",
      items: [
        {
          label: "Job Description",
          path: `/job-campaigns/${campaignId}/job-description`,
        },
      ],
    },
    {
      title: "People Search",
      items: [
        {
          label: "People Search",
          path: `/job-campaigns/${campaignId}/people-search`,
        },
        {
          label: "Call Dashboard",
          path: `/job-campaigns/${campaignId}/call-dashboard`,
        },
      ],
    },
    {
      title: "Hiring AI",
      items: [
        {
          label: "Applicants",
          path: `/job-campaigns/${campaignId}/applicants`,
        },
        {
          label: "Workflow Builder",
          path: `/job-campaigns/${campaignId}/workflow-builder`,
        },
        {
          label: "Final Round",
          path: `/job-campaigns/${campaignId}/hiring-ai/final-round`,
        },
        {
          label: "Call Dashboard",
          path: `/job-campaigns/${campaignId}/hiring-ai/call-dashboard`,
        },
      ],
    },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background:'white' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
      

        {/* Back to Dashboard */}
        <Box sx={{ px: 2, pt: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard")}
            sx={{
              textTransform: "none",
              color: "text.secondary",
              justifyContent: "flex-start",
              px: 1,
            }}
          >
            Back to Dashboard
          </Button>
        </Box>

        {/* Campaign Info */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            {campaign.campaign?.name || "Loading..."}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {campaign.campaign?.status || ""}
          </Typography>
        </Box>

        <Divider />

        {/* Navigation */}
        {sections.map((section) => (
          <Box key={section.title} sx={{ mt: 2 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{
                px: 3,
                fontWeight: 600,
              }}
            >
              {section.title}
            </Typography>

            <List>
              {section.items.map((item) => (
                <ListItemButton
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  sx={{
                    mx: 1,
                    borderRadius: 1,
                    "&.active": {
                      backgroundColor: "action.selected",
                    },
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        ))}
      </Drawer>

      {/* Page */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          margin:0,
          padding:0
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

