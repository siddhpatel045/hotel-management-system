import React from "react";
import { Container, Typography, TextField, Button, Paper } from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

const Contact = () => {
  return (
    <div className="bg-gray-50 py-24">
      <Container maxWidth="lg">
        {/* ===== Heading ===== */}
        <div className="text-center mb-20 flex flex-col items-center">
          <Typography variant="h3" className="font-bold text-gray-900 mb-4">
            Contact Aurevia Grand
          </Typography>

          <div className="w-24 h-1 bg-yellow-500 rounded-full mb-6"></div>

          <Typography className="text-gray-500 text-lg max-w-xl leading-relaxed">
            Whether you have questions about reservations, experiences, or
            special requests — the Aurevia Grand hospitality team is always
            ready to assist you.
          </Typography>
        </div>

        {/* ===== Main Layout ===== */}
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* ===== Left: Form ===== */}
          <Paper elevation={6} className="p-10 rounded-3xl">
            <Typography
              variant="h5"
              className="font-semibold text-gray-800 mb-8 text-center"
            >
              Send a Message
            </Typography>

            <form className="flex flex-col gap-6">
              <TextField fullWidth label="Full Name" />
              <TextField fullWidth label="Email Address" type="email" />
              <TextField fullWidth label="Subject" />
              <TextField fullWidth label="Message" multiline rows={4} />

              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#D4AF37",
                  color: "#000",
                  fontWeight: 600,
                  borderRadius: "10px",
                  paddingY: 1.5,
                  "&:hover": {
                    backgroundColor: "#b8962f",
                  },
                }}
              >
                SEND MESSAGE
              </Button>
            </form>
          </Paper>

          {/* ===== Right: Contact Info ===== */}
          <div className="flex flex-col gap-8">
            {/* Address */}
            <div className="bg-white shadow-md rounded-2xl p-8 flex items-center gap-6">
              <div className="bg-yellow-100 p-4 rounded-full">
                <LocationOnIcon className="text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Address</h3>
                <p className="text-gray-600 text-sm">
                  Aurevia Grand Hotel <br />
                  Bandra Kurla Complex, Bandra East <br />
                  Mumbai, Maharashtra 400051, India
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white shadow-md rounded-2xl p-8 flex items-center gap-6">
              <div className="bg-yellow-100 p-4 rounded-full">
                <PhoneIcon className="text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Phone</h3>
                <p className="text-gray-600 text-sm">+91 98765 43210</p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white shadow-md rounded-2xl p-8 flex items-center gap-6">
              <div className="bg-yellow-100 p-4 rounded-full">
                <EmailIcon className="text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Email</h3>
                <p className="text-gray-600 text-sm">
                  contact@aureviagrand.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Map Section ===== */}
        <div className="mt-28">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold text-gray-900">
              Visit Aurevia Grand
            </h2>
            <div className="w-20 h-1 bg-yellow-500 mx-auto mt-4 rounded-full"></div>
            <p className="text-gray-500 mt-4">
              Bandra Kurla Complex, Bandra East, Mumbai
            </p>
          </div>

          <div className="w-full h-[500px] shadow-2xl">
            <iframe
              title="Hotel Location"
              src="https://www.google.com/maps?q=Bandra+Kurla+Complex+Mumbai&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Contact;
