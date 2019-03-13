import "../style/style.sass"
import { Template } from "./models/Template";

const f = new Template();
f.name = 'Fredrik';

const y = new Template();
y.name = "ulf";

(<any>window).f = f;
(<any>window).y = y;
