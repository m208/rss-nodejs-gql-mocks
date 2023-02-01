import fetch from "node-fetch";
import { mockedProfiles, mockedUsers } from "./entries.js";

const URL = `http://127.0.0.1`;
const PORT = `3000`;


const subscribe = async (user1id, user2id) => {
            
    await fetch(`${URL}:${PORT}/users/${user2id}/subscribeTo`, {
        method: 'post',
        body: JSON.stringify({
            userId: user1id
        }),
        headers: {'Content-Type': 'application/json'}
    }) 
}

const generateMocks = async () => {
    const usersId = [];
    for (const mock of mockedUsers){
    
        const user = await (await fetch(`${URL}:${PORT}/users/`, {
            method: 'post',
            body: JSON.stringify(mock),
            headers: {'Content-Type': 'application/json'}
        })).json();
    
        usersId.push(user.id)
    }
    
    const profilesId = []
    for (const [index, value] of usersId.entries()){
    
        const profile = await (await fetch(`${URL}:${PORT}/profiles/`, {
            method: 'post',
            body: JSON.stringify({
                ...mockedProfiles[index],
                userId: value
            }),
            headers: {'Content-Type': 'application/json'}
        })).json();
        profilesId.push(profile.id);
    }
    
    let postCounter = 0;
    const maxPostsPerUser = 5;
    for (const [index, value] of usersId.entries()) {
    
        const randomCount = maxPostsPerUser;
        //const randomCount = Math.floor(Math.random() * maxPostsPerUser);
        
        for (let i = 0; i < randomCount; i++) {
            postCounter += 1;
    
            await fetch(`${URL}:${PORT}/posts/`, {
                method: 'post',
                body: JSON.stringify({
                    title: `post ${i+1} of ${randomCount}`,
                    content: `User # ${index + 1} some mocked content`,
                    userId: value
                }),
                headers: {'Content-Type': 'application/json'}
            })  
        }
    }
    
    for (let i = 1; i < usersId.length-1; i++) {
        subscribe(usersId[usersId.length-1], usersId[i]);
    }
    
    for (let i = 0; i < usersId.length-1; i++) {
        subscribe(usersId[i], usersId[usersId.length-1]);
    }
    
    return { 
        "created users": usersId,
        "created profiles": profilesId,
        "created posts": postCounter,
    };
    
}

const request = await generateMocks();
console.log(request);
