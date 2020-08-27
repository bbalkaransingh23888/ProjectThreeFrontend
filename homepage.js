//TODO: remove code if not being used
// $('.hamburgerdiv').on('click', () => {
//     $('.hamburgerdiv').toggleClass('open')
//     $('.hidden').toggleClass('show')
// })

let app = new Vue ({
    el: '#app',
    data: {
        loggedin: false,
        displayvideo: false,
        JWT: "",
        user: "",
        username: "",
        token:"",
        redbg: false,
        greenbg: false,
        displaycomment: false,
        displaycomments: false,
        comments: [],
        devURL: "http://localhost:3000",
        prodURL: null,
        videos: [],
        videoSource: null,
        video_Id: null,
        video_title: null,
        newComment: "",
        updateComment: "",
        updateDivComment: "",
        openEditDiv: 0,
        openDeleteDiv: 0,
        correctUser: 0
    },
    methods: {
        handleLogout: function(event) {
            console.log("clicked handleLogout")
            this.loggedin = false
            this.user = null
            this.token = null
            //TODO: might be best to remove this line for master, see comments on line 164
            //removes login data from local storage
            localStorage.clear();
            //After logout, page is refreshed via href
        },
        displayVideo: function(event) {
            this.displayvideo = true
            this.video_Id = event.target.parentNode.id
            this.showVideo(this.video_Id)
            this.getComments()
        },
        displayHomepage: function(event) {
            this.displayvideo = false
        },
        signUpToComment: function(event) {
            alert("You must be logged in to comment")
        },
        getComments: function() {
            const URL = this.prodURL ? this.prodURL : this.devURL;
            fetch(`${URL}/videos/${this.video_Id}/comments`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then((response) => response.json())
            .then((data) => {
                this.comments = data
            })
        },
        createComment: function() {
            if(this.loggedin) {
                const URL = this.prodURL ? this.prodURL : this.devURL;
                const textOfComment = {content: this.newComment}
                if (this.newComment === "") {
                    alert("You must have text.")
                } else {
                    fetch(`${URL}/videos/${this.video_Id}/users/${this.user}/comments`, {
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
                }
            } else {
                alert("You must be logged in to comment.")
            }
        },
        updateAComment: function() {
            const URL = this.prodURL ? this.prodURL : this.devURL;
            const textOfComment = {content: this.updateComment}
            const id = event.target.id
            if (this.updateComment === "") {
                alert("You must have text.")
            } else {
                fetch(`${URL}/videos/${this.video_Id}/users/${this.user}/comments/${id}`, {
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
            }
        },
        deleteAComment: function(event) {
            const URL = this.prodURL ? this.prodURL : this.devURL;
            const id = event.target.id
            fetch(`${URL}/videos/${this.video_Id}/users/${this.user}/comments/${id}`, {
            method: "delete",
            headers: {
                Authorization: `bearer ${this.token}`
            }
        })
            .then((response) => {
                this.getComments()
            })
        },
        vote: function(video_id, voteBoolean = null) {

        },
        thumbsUp: function(event) {
            //logic for thumbs up
            console.log("thumbs Up clicked")
            //check table to see if user has voted for video before(if row has been created)
            //IF user has voted then get boolean from route to check how user voted
                //true for thumbs up, false for thumbs down
                //if boolean is false (user has clicked thumbs down), then update to true (user has clicked thumbs up) and highlight thumbs up btn
                //if boolean is true (user has clicked thumbs up), then delete row  and unhighlight thumbs up btn 
            //IF user has not voted -> create row and set boolean to true, hightlight thumbs up btn
        },
        thumbsDown: function(event) {
            //logic for thumbs down
            console.log("thumbs Down clicked")
            //check table to see if user has voted for video before(if row has been created)
            //IF user has voted then get boolean from route to check how user voted
                //true for thumbs up, false for thumbs down
                //if boolean is false (user has clicked thumbs down), then delete row and unhighlight thumbs down btn
                //if boolean is true (user has clicked thumbs up), then update to false (user has clicked thumbs down) and highlight thumbs down btn
            //IF user has not voted -> create row and set boolean to false, hightlight thumbs down btn
        },
        getVideos: function() {
            fetch(`${this.devURL}/videos`)
            .then((response) => response.json())
            .then((data) => {
                this.videos = data.response
            })
        },
        showVideo: function(id) {
            fetch(`${this.devURL}/videos/${id}`, {
                method: "get",
                headers: {
                    "Content-type": "application/json"
                }
            })
            .then((response) => response.json())
            .then((data) => {
                this.videoSource = "https://youtube.com/embed/" + data.data.videoID 
                this.video_title = data.data.title
            })
        },
    },
    beforeMount(){
        this.getVideos()

        const checkIfLoggedIn = ()=> {
            let isLoggedIn = localStorage.getItem("vLoggedIn");
            //convert string to boolean
            if (isLoggedIn == "true") {
                //set variables that are passed in from local storage
                this.username = localStorage.getItem("vUsername");
                this.user = Number(localStorage.getItem("vUser"));
                this.correctUser = Number(localStorage.getItem("vUser"));
                this.token = localStorage.getItem("vToken");
                //TODO: with this line, the user stays logged in unless they log out 
                //accourding to https://vuejs.org/v2/cookbook/avoiding-memory-leaks.html,
                // users should not have to refresh their browser when using Single Page Application.
                // localStorage.clear();
                return true;
            } else { // returned null, or undefined because login file has not run yet
                return false;
            }
        }
        this.loggedin = checkIfLoggedIn();
        //TODO: remove log before commiting to master
        console.log("vloggedIn", this.loggedin);
        
    }
})

