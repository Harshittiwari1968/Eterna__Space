const axios= require("axios");

function sum(a,b){
    return a + b
}

const BACKEND_URL = "http://localhost:3000";

describe("Authentication",()=>{
    test("User be able to sign up", async() =>{
     const username = "space" + Math.random();
     const password = "123456789"

     const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
        username,
        password,
        type: "Admin"
     })

    expect(response.status).toBe(200);

    const updatedResponse =  await axios.post(`${BACKEND_URL}/api/v1/signup`,{
        username,
        password,
        type: "Admin"
     })

     expect(updatedResponse.status).toBe(400);
});
})