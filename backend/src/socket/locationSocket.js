import jwt from "jsonwebtoken";
import Trip from "../models/Trip.js";

export const setupLocationSocket =
  (io) => {

    io.on(
      "connection",
      (socket) => {

        console.log(
          "Socket connected:",
          socket.id
        );

        // Student joins a trip room
        socket.on(
          "track:join",
          ({ tripId }) => {

            if (!tripId) return;

            socket.join(
              `trip:${tripId}`
            );
          }
        );


        // Driver sends GPS
        socket.on(
          "driver:location",
          async ({
            tripId,
            latitude,
            longitude
          }) => {

            try {

              if (
                !tripId ||
                !Number.isFinite(latitude) ||
                !Number.isFinite(longitude)
              ) {
                return;
              }

              const token =
                socket.handshake.auth?.token;

              if (!token) return;

              let decoded;
              try {
                decoded = jwt.verify(
                  token,
                  process.env.JWT_SECRET
                );
              } catch {
                return;
              }

              if (decoded.role !== "driver") return;

              const trip =
                await Trip.findOne({
                  _id: tripId,
                  driver: decoded.id,
                  status: "RUNNING"
                });

              if (!trip) return;

              const updatedAt =
                new Date();

              trip.currentLocation = {
                latitude,
                longitude,
                updatedAt
              };

              await trip.save();

              io.to(
                `trip:${tripId}`
              ).emit(
                "bus:location",
                {
                  tripId:
                    trip._id.toString(),

                  busId:
                    trip.bus.toString(),

                  latitude,
                  longitude,

                  updatedAt
                }
              );

            } catch (error) {
              console.error(
                "Location error:",
                error.message
              );
            }
          }
        );


        socket.on(
          "disconnect",
          () => {
            console.log(
              "Socket disconnected:",
              socket.id
            );
          }
        );
      }
    );
  };

  