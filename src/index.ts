import server from "./app/index";

server.listen(process.env.PORT, () => 
    console.log(`Server running on -> http://localhost:${process.env.PORT}`)
);
