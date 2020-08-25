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
        redbg: false,
        greenbg: false,
        displaycomment: false,
        displaycomments: false,
        comments: [],
        newComment: "",
        updateComment: "",
        updateDivComment: "",
        openEditDiv: 0,
        hasUpVoted: false,
        hasDownVoted: false,
        openDeleteDiv: 0
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
                this.username = (data.user.username)
                this.user = (data.user.id)
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
            this.getComments()
        },
        displayHomepage: function(event) {
            this.displayvideo = false
        },
        getComments: function() {
            const URL = this.prodURL ? this.prodURL : this.devURL;
            fetch(`${URL}/videos/1/comments`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then((response) => response.json())
            .then((data) => {
                this.comments = data.data
            })
        },
        createComment: function() {
            const URL = this.prodURL ? this.prodURL : this.devURL;
            const textOfComment = {content: this.newComment}
            fetch(`${URL}/videos/1/users/${this.user}/comments`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${this.token}`
                },
                body: JSON.stringify(textOfComment)
            })
            .then((response) => response.json())
            .then((data) => {
                this.newComment = ""
                this.getComments()
            })
        },
        updateAComment: function() {
            const URL = this.prodURL ? this.prodURL : this.devURL;
            const textOfComment = {content: this.updateComment}
            const id = event.target.id
            fetch(`${URL}/videos/1/users/${this.user}/comments/${id}`, {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${this.token}`
                },
                body: JSON.stringify(textOfComment)
            })
            .then((response) => response.json())
            .then((data) => {
                this.updateComment = ""
                this.getComments()
                this.openEditDiv = 0
            })
        },
        deleteAComment: function(event) {
            const URL = this.prodURL ? this.prodURL : this.devURL;
            const id = event.target.id
            fetch(`${URL}/videos/1/users/${this.user}/comments/${id}`, {
            method: "delete",
            headers: {
                Authorization: `bearer ${this.token}`
            }
        })
            .then((response) => {
                this.getComments()
            })
        },
        thumbsUp: function(event) {
            //logic for thumbs up
            console.log("thumbs Up clicked")
            if(this.hasUpVoted){
                //logic to remove one to upvote on video
                //has upvoted to false
                this.hasUpVoted = false;
            }else {
                //logic to add one upvote on video
                //hasupvoted to true
                this.hasUpVoted = true;
                //if downvote is true, set to false, and remove one downvote
            }
            console.log(this.hasUpVoted)

        },
        thumbsDown: function(event) {
            //logic for thumbs down
            console.log("thumbs Down clicked")
            if(this.hasDownVoted){
                //logic to remove one to downvote on video
                //has downvoted to false
            }else {
                //logic to add one downvote on video
                //hasdownvoted to true
                //if upvote is true, set to false, and remove one upvote
            }
        },
        
    }
})

