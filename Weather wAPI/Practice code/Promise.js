// async function fetching(){
//     const res = await fetch('https://jsonplaceholder.typicode.com/users');
//     const data = await res.json();
//     console.log(data);
// }

// fetching();

// fetch('https://jsonplaceholder.typicode.com/users')
    // .then(res => res.json)
    // .then(data => console.log(data));

const getTextEL = document.getElementById('getText');
const getUserEL = document.getElementById('getUser');
const getPostEL = document.getElementById('getPost')
const outputEL = document.getElementById('output');
const clearEl = document.getElementById('clear');
const addPostEL = document.getElementById('addPost');

clearEl.addEventListener('click', clear);
getTextEL.addEventListener('click', getText);
getUserEL.addEventListener('click', getUser);
getPostEL.addEventListener('click', getPost);
addPostEL.addEventListener('submit', addPost);

// function getText(){
//     fetch('sample.txt')
//     .then((res) => res.text())
//     .then((data) => {
//         outputEL.innerHTML = data;
//     });
// }

async function getText(){
    const res = await fetch('sample.txt');
    let data = await res.text();
    outputEL.innerHTML = data;
}

// function getUser() {
//     fetch('users.json')
//     .then((res) => res.json())
//     .then((data) => {
//         let output = '<h2>Users</h2>'
//         data.forEach(user => {
//             output += `<ul>
//             <li>Id: ${user.id}</li>
//             <li>Name: ${user.name}</li>
//             <li>Email: ${user.email}</li>
//             </ul>`;
//         });
//         outputEL.innerHTML = output;
//     }) 
// }

async function getUser() {
    const res = await fetch('users.json');
    let data = await res.json();
    let output = '<h2>Users</h2>';
    data.forEach(user => {
        output += `<ul>
        <li>Id: ${user.id}</li>
        <li>Name: ${user.name}</li>
        <li>Email: ${user.email}</li>
        </ul>`;
    });
    outputEL.innerHTML = output;
}


// function getPost(){
//     fetch('https://jsonplaceholder.typicode.com/posts')
//     .then((res) => res.json())
//     .then((data) => {
//         let output = '<h2>Post</h2>'
//         data.forEach(post => {
//             output += `
//             <div>
//             <h3>${post.title}</h3>
//             <p>${post.body}</p>
//             </div>`;
//         });
//         outputEL.innerHTML = output;
//     }) 
// }

async function getPost(){
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    let data = await res.json();
    let output = '<h2>Post</h2>';
    data.forEach(post => {
        output += `
        <div>
        <h3>${post.title}</h3>
        <p>${post.body}</p>
        </div>`;
    });
    outputEL.innerHTML = output;
}

// function addPost(e){
//     e.preventDefault();
    
//     let titleEL = document.getElementById('title').value;
//     let bodyEL = document.getElementById('body').value;

//     fetch('https://jsonplaceholder.typicode.com/posts', {
//         method:'POST',
//         headers: {
//             'Accept': 'application/json, text/plain, */*',
//             'Content-type': 'application/json'
//         },
//         body: JSON.stringify({title:titleEL, body,bodyEL})
//     })
//     .then((res) => res.json())
//     .then((data) => console.log(data))
// }

async function addPost(e){
    e.preventDefault();
    
    let titleEL = document.getElementById('title').value;
    let bodyEL = document.getElementById('body').value;

    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method:'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({title:titleEL, body,bodyEL})
    })
    
    let data = await res.json();
    console.log(data);
}


function clear(){
    const clr = ""
    outputEL.innerHTML = clr;
}
