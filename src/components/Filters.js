import {filterData} from '../assets/filterData';
import { useState, useEffect } from 'react';
import { BsFilter } from 'react-icons/bs';


const Filters = ({ setFiltered, listings }) => {
    const [filters, setFilters] = useState({
        purpose: 'all',
        rooms: 0,
        price: 0,
        square: 0,
        region: 'all'
    })

    const {
        purpose, rooms, price, square, region
    } = filters
    
    const [toggle, setToggle] = useState(false)

    useEffect(() => {
        const filtered = [...listings]
        const data = filtered.filter(item => item.data.rooms*1 > rooms*1)
        .filter(item => item.data.offer ? item.data.discountedPrice*1 > price*1 : item.data.regularPrice*1 > price*1 )
        .filter(item => purpose !== 'all' ? item.data.type2 === purpose : item.data.rooms > 0)
        .filter(item => region !== 'all' ? item.data.address.includes(region) : item.data.rooms > 0)
        .filter(item => item.data.square*1 > square*1)
        setFiltered(data)
    }, [listings, filters])

    const onChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    return (
        <>
            <div className='filterToggle'>
                <h3>Filters</h3>
                <BsFilter onClick={() => setToggle(!toggle)} />
            </div>
            {toggle ? (
                <div className='filters'>
                    {filterData.map((filter) => (
                        <div key={filter.name}>
                        <label>{filter.placeholder}</label>
                        <select name={filter.name} onChange={onChange} placeholder={filter.placeholder}>
                            {filter.items.map((item) => (
                                <option key={item.value} value={item.value}>{item.name}</option>
                            ))}
                        </select>
                        </div>
                    ))}
                </div>
            ) : null}
            
        </>
    );
};

export default Filters;