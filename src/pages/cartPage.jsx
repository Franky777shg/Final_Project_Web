import React from 'react'

import { connect } from 'react-redux'
import Axios from 'axios'

// import UI
import {
    Paper,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Button,
    Typography

} from '@material-ui/core'

// import action
import { getCartUser } from '../actions'

// import
import { URL } from '../actions'

// import
import Wallpaper from '../assets/images/Wallpaper.jpg'

class CartPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            edited_product_id: null,
            edited_product_qty: 0,
            edited_total_sell: 0,
            edited_total_modal: 0,
            amount: 0
        }
    }

    async componentDidMount() {
        await this.props.getCartUser(localStorage.getItem('id'))
        this.calculateAmount()
    }

    // async componentDidUpdate() {
    //     await this.props.resultPcs.map((item, index) => { this.setState({ amount: this.state.amount + item.total_sell }) })
    //     await this.props.resultPkg.map((item, index) => { this.setState({ amount: this.state.amount + item.total_sell }) })
    // }

    calculateAmount = async () => {
        await this.props.resultPcs.map((item, index) => { this.setState({ amount: this.state.amount + item.total_sell }) })
        await this.props.resultPkg.map((item, index) => { this.setState({ amount: this.state.amount + item.total_sell }) })
    }

    resetState = async () => {
        await this.setState({ edited_product_qty: 0 })
        await this.setState({ edited_total_sell: 0 })
        await this.setState({ edited_total_modal: 0 })
        await this.setState({ edited_product_id: null })
    }

    // handling function
    handleDeletePcs = (item) => {
        console.log('Delete Pcs : ', item)

        const order_number = item.order_number
        const product_id = item.product_id

        console.log({ order_number }, { product_id })
        // axios delete gabisa ngirim body langsung, harus disetting, kalau params bisa
        Axios.delete(URL + '/deletepcs/' + order_number + '/' + product_id)
            .then(res => { this.props.getCartUser(localStorage.getItem('id')) })
            .catch(err => console.log(err))
    }

    handleEditPcs = async (product_id) => {
        console.log('Product Id : ', product_id)
        await this.setState({ edited_product_id: product_id })
        await console.log('edited_product_id : ', this.state.edited_product_id)
    }

    handleEditMinus = async (item) => {
        if (this.state.edited_product_qty === 0) return null

        await this.setState({ edited_product_qty: this.state.edited_product_qty - 1 })
        await this.setState({ edited_total_sell: item.price_sell * this.state.edited_product_qty })
        await this.setState({ edited_total_modal: item.price_modal * this.state.edited_product_qty })
    }

    handleEditPlus = async (item) => {
        await this.setState({ edited_product_qty: this.state.edited_product_qty + 1 })
        await this.setState({ edited_total_sell: item.price_sell * this.state.edited_product_qty })
        await this.setState({ edited_total_modal: item.price_modal * this.state.edited_product_qty })
    }

    handleEditConfirm = (item) => {

        if (!this.state.edited_product_qty || !this.state.edited_total_modal || !this.state.edited_total_sell) return console.log('quantity is empty')

        const body = {
            qty: this.state.edited_product_qty,
            total_modal: this.state.edited_total_modal,
            total_sell: this.state.edited_total_sell,
            product_id: item.product_id,
            order_number: item.order_number
        }
        console.log('body : ', body)

        Axios.patch(URL + '/editqtypcs', body)
            .then(res => {
                this.resetState()
                this.props.getCartUser(localStorage.getItem('id'))
                this.calculateAmount()
            })
            .catch(err => console.log(err))
    }

    handleEditCancel = () => {
        this.resetState()
    }

    // package
    handleDeletePkg = (item) => {
        console.log('item package', item)

        const order_number = item.order_number
        const package_id = item.package_no
        const package_no = item.package_no
        console.log({ order_number }, { package_id }, { package_no })

        Axios.delete(URL + '/deletepkg/' + order_number + '/' + package_id + '/' + package_no)
            .then(res => { this.props.getCartUser(localStorage.getItem('id')) })
            .catch(err => console.log(err))
    }

    // render Product Pcs
    renderTableHeadPcs = () => {
        return (
            <TableRow>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">Product</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Total</TableCell>
                <TableCell align="center">Action</TableCell>
            </TableRow>
        )
    }

    renderTableBodyPcs = () => {
        return this.props.resultPcs.map((item, index) => {
            // kalo edited
            if (item.product_id === this.state.edited_product_id) return (
                <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left" style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={item.image} style={{ width: 50 }}></img>
                        {item.product_name}
                    </TableCell>
                    <TableCell align="right">{item.price_sell}</TableCell>
                    <TableCell align="center">
                        <Button
                            onClick={() => this.handleEditMinus(item)}>-</Button>
                        {this.state.edited_product_qty}
                        <Button
                            onClick={() => this.handleEditPlus(item)}>+</Button>
                    </TableCell>
                    <TableCell align="right">{this.state.edited_total_sell}</TableCell>
                    <TableCell align="center">
                        <Button
                            onClick={() => this.handleEditConfirm(item)}
                            variant="outlined" color="secondary">confirm</Button>
                        <Button
                            onClick={this.handleEditCancel}
                            color="secondary">cancel</Button>
                    </TableCell>
                </TableRow>
            )

            // kalo gak diedit
            if (item.product_id !== this.state.edited_product_id) return (
                <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left" style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={item.image} style={{ width: 50 }}></img>
                        {item.product_name}
                    </TableCell>
                    <TableCell align="center">{item.price_sell}</TableCell>
                    <TableCell align="center">{item.product_qty}</TableCell>
                    <TableCell align="center">{item.total_sell}</TableCell>
                    <TableCell align="center">
                        <Button
                            onClick={() => this.handleEditPcs(item.product_id)}
                            variant="outlined" color="secondary">edit</Button>
                        <Button
                            onClick={() => this.handleDeletePcs(item)}
                            color="secondary">delete</Button>
                    </TableCell>
                </TableRow>
            )
        })
    }

    // render Product Pkg
    renderTableHeadPkg = () => {
        return (
            <TableRow>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">Package</TableCell>
                <TableCell align="center">Package Composition</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Action</TableCell>
            </TableRow>
        )
    }

    renderTableBodyPkg = () => {
        return this.props.resultPkg.map((item, index) => {
            return (
                <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>{item.package_name}</TableCell>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell>
                        {item.total_sell}
                        {/* {item.total_sell.split(',').forEach(element => console.log(element))} */}
                    </TableCell>
                    <TableCell>
                        <Button
                            onClick={() => this.handleDeletePkg(item)}
                            color="secondary">delete</Button>
                    </TableCell>
                </TableRow>
            )
        })
    }

    render() {
        // console.log('resultPcs : ', this.props.resultPcs)
        // console.log('resultPkg : ', this.props.resultPkg)

        return (
            <div style={styles.root}>
                <Paper style={styles.rootContainer} elevation={10}>
                    <div style={styles.header}>
                        {this.state.amount}
                        <Button>
                            Checkout
                        </Button>
                    </div>
                    {
                        this.props.resultPcs[0] ?
                            <Table style={{ marginBottom: 20 }}>
                                <TableHead style={{ backgroundColor: '#cbe2d6' }}>{this.renderTableHeadPcs()}</TableHead>
                                <TableBody>{this.renderTableBodyPcs()}</TableBody>
                            </Table>
                            : null
                    }
                    {
                        this.props.resultPkg[0] ?
                            <Table>
                                <TableHead style={{ backgroundColor: '#cbe2d6' }}>{this.renderTableHeadPkg()}</TableHead>
                                <TableBody>{this.renderTableBodyPkg()}</TableBody>
                            </Table>
                            : null
                    }
                </Paper>
            </div>
        )
    }
}

const styles = {
    root: {
        padding: '100px 10px 10px 10px',
        backgroundImage: `url(${Wallpaper})`,
        minHeight: '100vh',
        height: 'auto',
        display: 'flex',
        justifyContent: 'center'
    },
    rootContainer: {
        minHeight: '80vh',
        width: '80%',
        padding: '20px',
        borderRadius: 20
    },
    header: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}

const MapStateToProps = (globalState) => {
    return {
        resultPcs: globalState.cartReducer.resultPcs,
        resultPkg: globalState.cartReducer.resultPkg
    }
}

export default connect(MapStateToProps, { getCartUser })(CartPage)
