import axios from 'axios'; //axios paket je kao fetch samo sto radi i na starjijim browserima i sam vraca json file
import {key} from '../config'

export default class Search {

    constructor(query){
        this.query = query;
    }

    async getResults(){
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result);
        } catch(error){
            alert(error);
        }
    }
}
 
