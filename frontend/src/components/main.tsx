import React, { useState, useEffect } from 'react';

import Card from 'react-bootstrap/Card';
import Input from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import FormCheck from 'react-bootstrap/FormCheck'
import Spinner from 'react-bootstrap/Spinner'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'

import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import { apiCall } from '../utils/apiCall'

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

let pokedex: any = new Array()

const Main: React.FC = () => {

    let [allPokemons, setAllPokemons]: any = useState([])
    let [selectedPokemons, setSelectedPokemons]: any = useState([])
    let [navItems, setNavItems] = useState(["All"])
    let [currentNavItem, setCurrentNavItem] = useState("All") // used for rendering current categories
    let [newCategory, setNewCategory]: any = useState('')

    let [option, setOption]: any = useState('')

    let [pokemonCategories, setPokemonCategories]: any = useState({})

    let [showModal, setShowModal] = useState(false)

    let [delShowModal, setDelShowModal] = useState(false)


    let [lastOrder, setLastOrder]: any = useState({})


    const get_exisiting_order = () => {
        apiCall('get_order', 'get').then(resp => {
            if (resp.length > 0) {
                resp.forEach((order: any) => {
                    if (!navItems.includes(order.category)) {
                        navItems.push(order.category)
                        let poke_order = order.pokemon_order.split(',').map(Number);
                        pokemonCategories = {
                            ...pokemonCategories,
                            [order.category]: poke_order
                        }
                    }
                })
                console.log(navItems, pokemonCategories)
                setNavItems(navItems)
                setPokemonCategories(pokemonCategories)
            }
        })
    }


    useEffect(() => {

        apiCall('get_pokemons', 'get').then(resp => {
            setAllPokemons(resp)
            pokedex = resp
        })
        get_exisiting_order()
    }, [])

    const searchOnChange = (e: any) => {
        let filterText = e.target.value
        filterText = filterText.toLowerCase()

        allPokemons = pokedex.filter((pokemon: any) => {
            return pokemon.name.toLowerCase().indexOf(filterText) > -1
        })
        setAllPokemons(allPokemons)
    }

    const checkBoxOnChange = (e: any, pokemon: any) => {
        if (e.target.checked) {
            setSelectedPokemons([...selectedPokemons, pokemon])
        } else {
            let filtered = selectedPokemons.filter((elm: any) => elm !== pokemon)
            setSelectedPokemons(filtered)
        }
    }

    const saveNewCatChanges = () => {
        setNavItems([...navItems, newCategory])
        setPokemonCategories({
            ...pokemonCategories,
            [newCategory]: [...selectedPokemons]
        })

        setNewCategory('')
        setSelectedPokemons([])
        setShowModal(false)
    }


    const saveExtCatChanges = () => {
        let existingCategoryPokemons = pokemonCategories[option]

        setPokemonCategories({
            ...pokemonCategories,
            [option]: [...existingCategoryPokemons, ...selectedPokemons]
        })

        setSelectedPokemons([])
        setOption('')
        setShowModal(false)
    }


    const deleteCategory = (catName: any) => {

        apiCall('delete_category', 'post', { "category": catName }).then(resp => {
            alert(JSON.stringify(resp))
        })

        delete pokemonCategories[catName]
        setCurrentNavItem("All")

        let newNav = navItems.filter(elm => catName !== elm)
        setNavItems(newNav)
        setDelShowModal(false)
    }

    const reorder = (list: any, startIndex: any, endIndex: any) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };


    const onDragEnd = (result: any) => {
        console.log(result)

        // dropped outside the list
        if (!result.destination) {
            return;
        }

        setLastOrder({ ...lastOrder, [currentNavItem]: pokemonCategories[currentNavItem] })

        const items = reorder(
            pokemonCategories[currentNavItem],
            result.source.index,
            result.destination.index
        );

        console.log(items)

        setPokemonCategories({ ...pokemonCategories, [currentNavItem]: items })
    }

    const undo_reorder = (item: any) => {
        if (!(item in lastOrder)) {
            alert("No Last Order Available")
            return
        }

        setPokemonCategories({
            ...pokemonCategories,
            [item]: lastOrder[item]
        })
    }

    const saveOrder = (item: any) => {
        console.log(pokemonCategories[currentNavItem])
        let data = JSON.stringify({
            "category": item,
            "pokemon_list": pokemonCategories[item]
        })
        apiCall('save_order', 'post', data ).then(resp => {
            alert(JSON.stringify(resp))
        })
    }

    const renderContent = (item: any) => {
        if (item === 'All') {
            return (
                <>
                    <div className="mt-3 mb-3">
                        <Input.Text id="inputGroup-sizing-sm">
                            <FormControl
                                // value={searchKeyword}
                                placeholder="Search Pokemons"
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={(e: any) => searchOnChange(e)}
                            />
                        </Input.Text>
                    </div>

                    {selectedPokemons.length > 0 ?
                        <div className="mt-4 mb-4">
                            <Button onClick={() => setShowModal(true)}>
                                Add to Category
                            </Button>
                        </div>
                        : ''}

                    <div>
                        {allPokemons.length > 0 ?
                            allPokemons.map((pokemon: any) => {
                                return (
                                    <Card key={pokemon.id} className="mb-3">
                                        <Card.Body>
                                            <div className="row">
                                                <div className="col-">
                                                    <FormCheck
                                                        id={pokemon.id}
                                                        onChange={(e: any) => checkBoxOnChange(e, pokemon.id)}
                                                        checked={selectedPokemons.includes(pokemon.id) ? true : false}
                                                    />
                                                </div>
                                                <div className="col-3">
                                                    <img src={pokemon.thumbnail_image} alt={pokemon.alt_text} height="100px" />
                                                </div>
                                                <div className="col-3">
                                                    <Card.Title><h3>{pokemon.name}</h3></Card.Title>
                                                    <Badge pill variant="secondary">{pokemon.type0 ? pokemon.type0 : ''}</Badge>
                                                    <Badge pill variant="secondary">{pokemon.type1 ? pokemon.type1 : ''}</Badge>
                                                </div>
                                                <div className="col-5">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <h6 className="font-weight-bold">Abilities</h6>
                                                            <p>{pokemon.abilities0 ? pokemon.abilities0 : ''}</p>
                                                            <p>{pokemon.abilities1 ? pokemon.abilities1 : ''}</p>
                                                        </div>
                                                        <div className="col-6">
                                                            <h6 className="font-weight-bold">Weakness</h6>
                                                            <p>{pokemon.weakness0 ? pokemon.weakness0 : ''}</p>
                                                            <p>{pokemon.weakness1 ? pokemon.weakness1 : ''}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                )
                            }) : <Spinner animation="grow" variant="warning" />}
                    </div>
                </>
            )
        } else {
            console.log(pokemonCategories)
            return (
                <div>
                    <div className="row mb-4 mt-4">
                        <div className="col-12">
                            <Button className="mt-2 mb-2" variant="danger" onClick={() => setDelShowModal(true)}>
                                Delete Category
                            </Button>

                            <Button
                                className="mt-2 mb-2" variant="primary"
                                onClick={() => undo_reorder(item)}
                            // disabled={Object.keys(lastOrder).length < 1 ? true: false}
                            >
                                Undo Reorder
                            </Button>

                            <Button
                                className="mt-2 mb-2" variant="primary"
                                onClick={() => saveOrder(item)}
                            >
                                Save Order
                            </Button>
                        </div>
                    </div>
                    <div>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {pokemonCategories[item].map((itm: any, index: any) => (
                                            <Draggable key={itm ? itm.toString() : ''} draggableId={itm ? itm.toString() : ''} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}

                                                    >
                                                        {
                                                            <Card key={itm} className="mb-3">
                                                                <Card.Title>
                                                                    {pokedex.map((poke: any) => {
                                                                        if (itm === poke.id)
                                                                            return (
                                                                                poke.name
                                                                            )
                                                                    })}
                                                                </Card.Title>

                                                            </Card>
                                                        }
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="row">
            <div className="col-6 offset-3 shadow-lg p-3 mb-5 mt-5 bg-white">
                <div className="mt-3 mb-3">

                    <Tabs defaultActiveKey={currentNavItem}
                        id="uncontrolled-tab-example"
                        onSelect={(evtKey: any, event: any) => setCurrentNavItem(evtKey)}
                    >
                        {navItems.map((item, key) => {
                            return (
                                <Tab eventKey={item} title={item} key={key}>
                                    {renderContent(item)}
                                </Tab>
                            )
                        })}
                    </Tabs>

                </div>
            </div>

            {/* ---------------- Modal --------------- */}

            <Modal show={showModal} onEscapeKeyDown={() => setShowModal(false)} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="row p-2">
                        {Object.keys(pokemonCategories).length > 0 ?
                            <div className="col-12 mt-4 mb-4 shadow-lg p-3 bg-white">
                                <h5>Select Existing Category</h5>
                                <DropdownButton id="dropdown-item-button" title="Select">
                                    {Object.keys(pokemonCategories).map(item => {
                                        return (
                                            <Dropdown.Item
                                                eventKey={item}
                                                key={item}
                                                as="button"
                                                onSelect={(evtKey, event) => setOption(evtKey)}
                                            >{item}</Dropdown.Item>
                                        )
                                    })}
                                </DropdownButton>
                                <Button className="mt-4" variant="outline-success" onClick={saveExtCatChanges}>
                                    Save Changes
                                </Button>
                            </div>
                            : ''}

                        <div className="col-12 mt-4 mb-4 shadow-lg p-3 bg-white">
                            <h5>Create a New Category</h5>
                            <Input.Text id="inputGroup-sizing-sm">
                                <FormControl
                                    // value={newCategory}
                                    placeholder="Enter Category Name"
                                    aria-label="Small"
                                    aria-describedby="inputGroup-sizing-sm"
                                    onChange={(e: any) => setNewCategory(e.target.value)}
                                />
                            </Input.Text>
                            <Button className="mt-4" variant="outline-success" onClick={saveNewCatChanges}>
                                Save Changes
                            </Button>
                        </div>

                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                show={delShowModal}
                onEscapeKeyDown={() => setDelShowModal(false)}
                onHide={() => setDelShowModal(false)}
            >
                <Modal.Header closeButton>
                    Are you sure you want to delete ?
                </Modal.Header>
                <Modal.Body>
                    <Button variant="danger" onClick={() => deleteCategory(currentNavItem)}>
                        Delete
                    </Button>
                </Modal.Body>
            </Modal>

        </div>
    )
}


export default Main