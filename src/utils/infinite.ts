import { InfiniteNode } from './types'
import '../styles/infinite.scss'
const ITEM_NUM = 30,
  TOMBSTONE_NUM = 30,
  TOMBSTONE_DEFAULT_WIDTH = 500,
  TOMBSTONE_DEFAULT_HEIGHT = 80

export default class InfiniteScroll {
  private _top: any
  private _listEl: any
  private _items: Array<InfiniteNode> = []
  private _tombstone: Array<HTMLElement> = []
  private _tombstoneIdx = 0
  private showIndex = 0

  init(config: any): void {
    this._listEl = config.el
    if (this._listEl) {
      this._top = document.createElement('div')
      this._top.style.position = 'absolute'
      this._top.style.width = '1px'
      this._top.style.height = '1px'
      this._top.style.top = '0'
      this._top.style.left = '0'
      this._listEl.appendChild(this._top)
      this._initViewBlock()
      this._initTombstone()
      this._listEl.addEventListener('scroll', this._onScroll.bind(this))
    }
  }

  private _initViewBlock() {
    let fragment = document.createDocumentFragment()
    for (let i = 0; i < ITEM_NUM; ++i) {
      let dom = document.createElement('div')
      dom.className = 'temp'
      dom.style.width = TOMBSTONE_DEFAULT_WIDTH + 'px'
      dom.style.height = TOMBSTONE_DEFAULT_HEIGHT + 'px'
      dom.style.transform = 'translateY(' + (TOMBSTONE_DEFAULT_HEIGHT + 10) * i + 'px)'
      dom.innerText = `${i}`
      fragment.appendChild(dom)
      this._items.push({
        index: i,
        data: null,
        node: dom,
        width: TOMBSTONE_DEFAULT_WIDTH,
        height: TOMBSTONE_DEFAULT_HEIGHT,
        top: (TOMBSTONE_DEFAULT_HEIGHT + 10) * i
      })
    }
    this.showIndex = ITEM_NUM - 1
    this._listEl.appendChild(fragment)
  }

  private _initTombstone() {
    let fragment = document.createDocumentFragment()
    for (let i = 0; i < TOMBSTONE_NUM; ++i) {
      let dom = document.createElement('div')
      dom.className = 'tombstone hidden'
      dom.style.width = TOMBSTONE_DEFAULT_WIDTH + 'px'
      dom.style.height = TOMBSTONE_DEFAULT_HEIGHT + 'px'
      this._tombstone.push(dom)
      fragment.appendChild(dom)
    }
    this._listEl.appendChild(fragment)
  }

  private _onScroll(e: any) {
    if (e.target) {
      let dis = e.target.scrollTop - this._top.offsetTop
      if (dis > (TOMBSTONE_DEFAULT_HEIGHT + 10) * 10) {
        let num = Math.floor(dis / (TOMBSTONE_DEFAULT_HEIGHT + 10) / 2)
        this._top.style.top = this._top.offsetTop + (TOMBSTONE_DEFAULT_HEIGHT + 10) * num + 'px'
        this._sortItems(this._items.splice(0, num), 'end')
      } else if (dis <= -(TOMBSTONE_DEFAULT_HEIGHT + 10)) {
        let num = Math.floor(-dis / (TOMBSTONE_DEFAULT_HEIGHT + 10))
        this._top.style.top = this._top.offsetTop - (TOMBSTONE_DEFAULT_HEIGHT + 10) * num + 'px'
        this._sortItems(this._items.splice(this._items.length - num, num), 'front')
      }
    }

  }

  private _sortItems(arr: Array<InfiniteNode>, pos: string) {
    if (pos === 'end') {
      arr.forEach((val: InfiniteNode) => {
        val.index = ++this.showIndex
        val.top = (TOMBSTONE_DEFAULT_HEIGHT + 10) * val.index
        val.node.style.transform = 'translateY(' + val.top + 'px)'
        //val.node.style.top =  val.top + 'px'
        this._items.push(val)
        this.requestContent(val)
      })
    } else if (pos === 'front') {
      arr.forEach((val) => {
        this.showIndex--
        val.index = this.showIndex + 1 - ITEM_NUM
        val.top = (TOMBSTONE_DEFAULT_HEIGHT + 10) * val.index
        val.node.style.transform = 'translateY(' + val.top + 'px)'
        this._items.unshift(val)
        this.requestContent(val)
      })
    }
  }

  private _onResize() {

  }
  private requestContent(item: any) {
    let tombstone = this._tombstone[this._tombstoneIdx]
    this._tombstoneIdx = (this._tombstoneIdx + 1) % TOMBSTONE_NUM
    item.node.className = 'temp hidden'
    //tombstone.style.transform = 'translateY('+item.top + 'px)'
    tombstone.style.transform = 'translateY(' + item.top + 'px)'
    tombstone.className = 'tombstone'
    setTimeout(function () {
      tombstone.className = 'tombstone hidden'
      item.node.innerText = item.index
      item.node.className = 'temp'
    }, 2000)
  }

  // private addContent() {
  //   for (let i = 0; i < ITEM_NUM; ++i) {
  //     this._items.push({
  //       data: null,
  //       node: null,
  //       width: 0,
  //       height: 0,
  //       top: 0
  //     })
  //   }
  //   this.fillContent(this._itemStart, this._itemEnd)
  // }
}
