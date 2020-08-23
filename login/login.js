// console.log('Hello World')

// // where the heroku website will be
// // const deployedURL = ''
// const deployedURL = null
// // developmental purposes will use local host
// const URL = deployedURL ? deployedURL : "http://localhost:3000"


// const $createbutton = $('#createbutton')
// const $loginbutton = $('#loginbutton')
// let token = null
// let user = null

// $createbutton.on('click', async(event) => {
//     const create_info = {
//         username: $('#newusername').val(),
//         password: $('#newpassword').val()
//     }
//     const response = await fetch(`${URL}/users`, {
//         method: "post",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(create_info)
//     })
//     console.log(response);
// })

// $loginbutton.on('click', async(event) => {
//     const login_info = {
//         username: $('#username').val(),
//         password: $('#password').val()
//     }
//     const response = await fetch(`${URL}/login`, {
//         method: "post",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(login_info)
//     })
//     const r = await response.json()
//     token = r.token
//     user = r.user.username
// })

// $('#submitcomment').on('click', () => {
//     console.log(token);
//     console.log(user);
// })

let app = new Vue ({
    el: '#app',
    data: {
        loggedin: false,
        displayvideo: false,
        JWT: "",
        loginUser: "",
        loginPass: "",
        createUser: "",
        createPass: "",
        devURL: "http://localhost:3000",
        prodURL: null,
        user: null,
        username: null,
        token: null,
        open: false,
        show: false
    },
    methods: {
        handleLogin: function(event) {
            const URL = this.prodURL ? this.prodURL : this.devURL
            const user = {username: this.loginUser, password: this.loginPass}
            fetch(`${URL}/login`, {
                method: "post",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(user)
            })
            .then((response) => response.json())
            .then((data) => {
                this.user = (data.user.username)
                this.token = data.token
                this.loggedin = true
                this.loginUser = ""
                this.loginPass = ""
            })
        },
        handleLogout: function(event) {
            this.loggedin = false
            this.user = null
            this.token = null
        },
        handleCreate: function(event) {
            const URL = this.prodURL ? this.prodURL : this.devURL
            const user = {username: this.createUser, password: this.createPass}
            fetch(`${URL}/users`, {
                method: "post",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(user)
            })
            .then((response) => response.json)
            .then((data) => {
                if (data.error) {
                    alert('Creation Unsuccessful')
                } else {
                    alert('Creation Successful! Please log in.')
                }
                this.createUser = ""
                this.createPass = ""
            })
        },
        displayVideo: function(event) {
            this.displayvideo = true
        },
        displayHomepage: function(event) {
            this.displayvideo = false
        }
    }
})
