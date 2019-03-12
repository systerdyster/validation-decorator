import "../style/style.sass"
import { Form } from "./models/Form";

const f = new Form();
f.name = 'Fredrik';
f.age = 36;

const y = new Form();
y.name = "ulf";
y.age = 25;

(<any>window).f = f;
(<any>window).y = y;
