import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from "@mui/material";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box className="bg-[#1c1c1c] text-gray-300 pt-10 pb-6">
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Brand */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              className="text-yellow-600 font-serif mb-2"
            >
              Aurevia Grand
            </Typography>
            <Typography className="text-sm text-gray-400 max-w-sm">
              Luxury redefined with elegant stays, world-class hospitality, and
              unforgettable experiences.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <div className="flex justify-center md:justify-start gap-6 text-sm">
              <Link
                href="/destinations"
                underline="none"
                color="inherit"
                className="hover:text-yellow-600 transition"
              >
                Destinations
              </Link>
              <Link
                href="/hotels"
                underline="none"
                color="inherit"
                className="hover:text-yellow-600 transition"
              >
                Hotels
              </Link>
              <Link
                href="/experiences"
                underline="none"
                color="inherit"
                className="hover:text-yellow-600 transition"
              >
                Experiences
              </Link>
              <Link
                href="/offers"
                underline="none"
                color="inherit"
                className="hover:text-yellow-600 transition"
              >
                Offers
              </Link>
            </div>
          </Grid>

          {/* Social */}
          <Grid item xs={12} md={4}>
            <div className="flex justify-center md:justify-end gap-3">
              <IconButton className="text-gray-400 hover:text-yellow-600 transition">
                <Facebook />
              </IconButton>
              <IconButton className="text-gray-400 hover:text-yellow-600 transition">
                <Instagram />
              </IconButton>
              <IconButton className="text-gray-400 hover:text-yellow-600 transition">
                <Twitter />
              </IconButton>
            </div>
          </Grid>
        </Grid>

        {/* Bottom Line */}
        <Box className="border-t border-gray-700 mt-8 pt-4 text-center">
          <Typography className="text-xs text-gray-500">
            © {new Date().getFullYear()} Aurevia Grand Hotels. All rights
            reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
