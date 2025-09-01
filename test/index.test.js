const axios = require("axios");
const { use } = require("react");

function sum(a, b) {
    return a + b
}

const BACKEND_URL = "http://localhost:3000";

describe("Authentication", () => {
    test('User be able to sign up only once', async () => {
        const username = "space" + Math.random();
        const password = "123456789"

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "Admin"
        })

        expect(response.status).toBe(200);

        const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "Admin"
        })

        expect(updatedResponse.status).toBe(400);
    });

    test('signup request fails if the username is empty', async () => {
        const username = `harshit-${Math.random()}`
        const password = "123456789"

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            password,
            type: "Admin"
        })
        expect(response.status).toBe(400);
    });

    test('sign in succed if the username and password is correct ', async () => {
        const username = `harshit-${Math.random()}`
        const password = "123456789"

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "Admin"
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    test('sign in fails if the username and password is incorrect ', async () => {
        const username = `harshit-${Math.random()}`
        const password = "1234567"

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: "Wrong username",
            password
        })
        expect(response.status).toBe(403);
    });
})

describe("User metadata end points ", () => {

    let token = "";
    let avatarId = "";

    beforeAll(async () => {
        const username = `harshit-${Math.random()}`
        const password = "123456789"

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "Admin"
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password,
        });

        token = response.data.token;

        const avatar = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        })

        avatarId = avatarResponse.data.avatarId;
    })


    test("User cant update their metadata with a wrong avatar id  ", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/usermetadata`, {
            avatarId: "1234521535"
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        expect(response.status).toBe(400);
    })

    test("User can update their metadata with a right avatar id ", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/usermetadata`, {
            avatarId
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        expect(response.status).toBe(200);
    })

    test("User is not able to update their meta data if the auth header is not present ", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/usermetadata`, {
            avatarId
        })
        expect(response.status).toBe(403);
    })
})

describe("User avatar information", () => {
    let avatarId;
    let token;
    let userid;

    beforeAll(async () => {
        const username = `harshit-${Math.random()}`
        const password = "123456789"

        const signupresponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "Admin"
        });

        userid = signupresponse.data.userId;

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password,
        });

        token = response.data.token;

        const avatar = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        })

        avatarId = avatarResponse.data.avatarId;
    })

    test("Get back avatar information for a user", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`);

        expect(response.data.avatars.length).toBe(1);
        expect(response.data.avatars[0].userId).toBe(userId);
    })

    test("Available avatars list the recently created avatars", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/avatars`);
        expect(response.data.avatars.length).not.toBe(0);
        const currentAvatar = response.data.avatars.find(x => x.id == avatarId);
        expect(currentAvatar).toBeDefined();
    })
})

describe("Space information ", () => {
    let mapId;
    let element1Id;
    let element2Id;
    let admintoken;
    let adminid;
    let usertoken;
    let userid;

    beforeAll(async () => {
        const username = `harshit-${Math.random()}`
        const password = "123456789"

        const usersignupresponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "Admin"
        });


        userid = usersignupresponse.data.userId;

        const usersigninresponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password,
        });

        usertoken = usersigninresponse.data.token;

        const signupresponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "Admin"
        });

        adminid = signupresponse.data.userId;

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password,
        });

        admintoken = response.data.token;

        const element1Id = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            headers: {
                Authorization: `Bearer ${admintoken}`
            }
        });

        const element2Id = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            headers: {
                Authorization: `Bearer ${admintoken}`
            }
        });

        element1Id = element1Id.id;
        element2Id = element2Id.id;

        const map = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
                elementId: element1Id,
                x: 20,
                y: 20
            }, {
                elementId: element1Id,
                x: 18,
                y: 20
            }, {
                elementId: element2Id,
                x: 19,
                y: 20
            }]
        }, {
            headers: {
                Authorization: `Bearer ${admintoken}`
            }
        })

        mapId = map.data.mapId;
    });

    test("User is able to create a space ", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100*200",
            "mapID": mapId
        }, {
            headers: {
                Authorization: `Bearer ${usertoken}`
            }
        })
        expect(response.spaceId).toBeDefined();
    })

    test("User is able to create a space without mapID(empty space) ", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100*200",
        }, {
            headers: {
                Authorization: `Bearer ${usertoken}`
            }
        })
        expect(response.spaceId).toBeDefined();
    })

    test("User is not able to create a space without mapID and dimensions ", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
        }, {
            headers: {
                Authorization: `Bearer ${usertoken}`
            }
        })
        expect(response.status).toBe(400);
    })

    test("User is not able to delete a space that does`t exist", async () => {
        const response = await axios.delete(`${BACKEND_URL}/api/v1/space/randomIdDoesntExist`)
        expect(response.status).toBe(400);
    }, {
        headers: {
            Authorization: `Bearer ${usertoken}`
        }
    })

    test("User is able to delete a space that does exist ", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100*200",
        }, {
            headers: {
                Authorization: `Bearer ${usertoken}`
            }
        })

        const deleteresponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`)
        expect(deleteresponse.status).toBe(200);
    })

    test("User should not able to delete a space created by another user ", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100*200",
        }, {
            headers: {
                Authorization: `Bearer ${usertoken}`
            }
        })

        const deleteresponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`, {
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        })
        expect(deleteresponse.status).toBe(403);
    })

    test("Admin is no spaces initially", async () => {
        const spacecreateresponse = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        })
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`)
        const filteredspace = response.data.spaces.find(x => x.Id == spacecreateresponse.spaceId);
        expect(response.data.spaces.length).toBe(1);
        expect(filteredspace).toBeDefined();
    })

    test("Admin is no spaces initially", async () => {
        const spacecreateresponse = await axios.post(`${BACKEND_URL}/api/v1/space/all`, {
            "name": "Test",
            "dimensions": "100*200"
        }, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        })
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`)
        const filteredspace = response.data.spaces.find(x => x.Id == spacecreateresponse.spaceId);
        expect(response.data.spaces.length).toBe(1);
        expect(filteredspace).toBeDefined();
    })
})