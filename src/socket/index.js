const socketIo = (io) => {
  io.on("connection", (socket) => {
    console.log(`client connect : ${socket.id}`);
    socket.on("cart changed", async (data) => {
      io.emit(`cart changed ${data.buyerId}`);
    });
    socket.on("transaction", async (data) => {
      console.log("transaction", data);
      io.emit(`transaction`);
    });
    socket.on("product", async () => {
      io.emit(`product`);
    });
  });
};

module.exports = socketIo;
