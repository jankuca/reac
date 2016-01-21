import it from 'ava'
import doc from 'virtual-dom/node_modules/global/document'

import { Component, DomDriver, Renderer, element } from '../../lib/index'


function createRenderer() {
  let driver = new DomDriver()
  let renderer = new Renderer(driver)
  return renderer
}


it('should render a root-level component', (test) => {
  class RootComponent extends Component {
    render() {
      return element('div', { className: 'root-component' })
    }
  }

  let renderer = createRenderer()
  let node = doc.createElement('div')

  let el = element(RootComponent)
  renderer.render(el, node)
  test.same(node.childNodes.length, 1)
  test.same(node.childNodes[0].className, 'root-component')
})

it('should unmount a root-level component', (test) => {
  class RootComponent extends Component {
    render() {
      return element('div', { className: 'root-component' })
    }
  }

  let renderer = createRenderer()
  let node = doc.createElement('div')

  let el = element(RootComponent)
  renderer.render(el, node)

  renderer.unmountComponentAtNode(node)
  test.same(node.childNodes.length, 0)
})

it('should render a root-level component with props', (test) => {
  class RootComponent extends Component {
    render() {
      return element('div', { className: this.props.className })
    }
  }

  let renderer = createRenderer()
  let node = doc.createElement('div')

  let el = element(RootComponent, { className: 'root-component' })
  renderer.render(el, node)
  test.same(node.childNodes.length, 1)
  test.same(node.childNodes[0].className, 'root-component')
})

it('should update a root-level component with new props', (test) => {
  class RootComponent extends Component {
    render() {
      return element('div', { className: this.props.className })
    }
  }

  let renderer = createRenderer()
  let node = doc.createElement('div')

  let el1 = element(RootComponent, { className: 'a' })
  renderer.render(el1, node)

  let el2 = element(RootComponent, { className: 'b' })
  renderer.render(el2, node)
  test.same(node.childNodes.length, 1)
  test.same(node.childNodes[0].className, 'b')
})

