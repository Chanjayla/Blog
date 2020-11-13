import Vue from 'vue'
import {
    Breadcrumb,
    BreadcrumbItem,
    Row,
    Col,
    Button,
    Select,
    Input,
    Option,
    Switch,
    Pagination,
    Upload,
    Table,
    TableColumn,
    Form,
    FormItem,
    Menu,
    Submenu,
    MenuItem,
    Tag,
    Drawer,
    Collapse,
    Message,
    MessageBox,
    DatePicker,
    Progress,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Dialog,
    Tooltip
} from 'element-ui'
// import Breadcrumb from 'element-ui/packages/breadcrumb'
// import BreadcrumbItem from 'element-ui/packages/breadcrumb-item'
// import Row from 'element-ui/packages/row'
// import Col from 'element-ui/packages/col'
// import Button from 'element-ui/packages/button'
// import Select from 'element-ui/packages/select'
// import Input from 'element-ui/packages/input'
// import Option from 'element-ui/packages/option'
// import Swtich from 'element-ui/packages/switch'
// import Pagination from 'element-ui/packages/pagination'
// import Upload from 'element-ui/packages/upload'
// import Table from 'element-ui/packages/table'
// import TableColumn from 'element-ui/packages/table-column'
// import Form from 'element-ui/packages/form'
// import FormItem from 'element-ui/packages/form-item'
// import Menu from 'element-ui/packages/menu'
// import Submenu from 'element-ui/packages/submenu'
// import MenuItem from 'element-ui/packages/menu-item'
// import Tag from 'element-ui/packages/tag'
// import Drawer from 'element-ui/packages/drawer'
// import Collapse from 'element-ui/packages/collapse'
// import Message from 'element-ui/packages/message'
// import DatePicker from 'element-ui/packages/date-picker'
// import Progress from 'element-ui/packages/progress'
// import Dropdown from 'element-ui/packages/dropdown'
// import DropdownItem from 'element-ui/packages/dropdown-item'
// import DropdownMenu from 'element-ui/packages/dropdown-menu'
// import Dialog from 'element-ui/packages/dialog'
// import Tooltip from 'element-ui/packages/tooltip'

Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Button)
Vue.use(Select)
Vue.use(Input)
Vue.use(Option)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Upload)
Vue.use(Table)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Tag)
Vue.use(Drawer)
Vue.use(Collapse)
Vue.use(DatePicker)
Vue.use(TableColumn)
Vue.use(Progress)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Dialog)
Vue.use(Tooltip)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt