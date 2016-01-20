import { Component, DomDriver, Renderer, element } from '../../lib/index'
/** @jsx element */


class TypeA extends Component {
  render() {
    return <div className='class-a' />
  }
}

class TypeB extends Component {
  render() {
    return <div className='class-b' />
  }
}


function main() {
  let driver = new DomDriver()
  let renderer = new Renderer(driver)

  let elementA1 = <TypeA />
  let elementA2 = <TypeA />
  let elementB = <TypeB />

  let node = document.createElement('div')
  document.body.appendChild(node)
  console.log(node.outerHTML)

  renderer.render(elementA1, node)
  console.log(node.outerHTML)

  renderer.render(elementA2, node)
  console.log(node.outerHTML)

  renderer.render(elementB, node)
  console.log(node.outerHTML)
}


main()
