export default class Likes{
    constructor(){
        this.likes = [];
    }

    addLike(id, title, author, img){
        const like = { 
            id, 
            title, 
            author, 
            img 
        };
        this.likes.push(like);

        //Persist data in localStorage
        this.persistData();

        return like;
    }

    deleteLike(id){
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index,1);

        //Persist data in localStorage
        this.persistData();
    }

    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !== -1; //sve sto je razlicito od -1 znaci da je lajkovan
    }

    getNumLikes(){
        return this.likes.length;
    }

    persistData(){
        localStorage.setItem('likes', JSON.stringify(this.likes)); //cuvamo lajkove na localstorage od browsera pod nazivom 'likes' i moramo da this.likes(int) pretvorimo u string preko JSON.stringify 
    }

    readStorage(){
        const storage = JSON.parse(localStorage.getItem('likes')); //vucemo podatke iz 'likes' localstorage i parsiramo ih iz string u default tj. u value
        
        //Restore likes from the localStorage
        if(storage) this.likes = storage;
    }
}