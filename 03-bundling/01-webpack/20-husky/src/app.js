import DIV from './components/div';
import './styles.css';

let divComponent = DIV();
divComponent.classList.add('text-color');
document.body.appendChild(divComponent);
const input = document.createElement('input');
input.type = 'text';

document.body.appendChild(input);

if (module.hot){
    module.hot.accept('./components/div.js', () =>{
        const newComponent = DIV();
        document.body.replaceChild(newComponent, divComponent);

        divComponent = newComponent;
    })
}