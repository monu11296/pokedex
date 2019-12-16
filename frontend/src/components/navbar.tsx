import React, { useState } from 'react'
import Nav from 'react-bootstrap/Nav'
import Card from 'react-bootstrap/Card'

import Tabs from 'react-bootstrap/Tabs'

import AllPokemons from './main'

const NavBar: React.FC = () => {

    let [currentComponent, setCurrentComponent] = useState("1")

    const handleSelect = (eventKey: any) => {
        setCurrentComponent(eventKey)
    }

    const renderComponent = () => {
        console.log(currentComponent)
        if (currentComponent === "1")
            return <AllPokemons />
    }


    return (
        <div className="row">
            <div className="col-6 offset-3">
                <Card>
                    <Card.Header>
                        <Nav variant="pills" activeKey={currentComponent}
                            onSelect={handleSelect}
                        >
                            <Nav.Item>
                                <Nav.Link eventKey="1">
                                    All Pokemons
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="2">
                                    Category 1
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="3">
                                    Category 2
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Card.Header>
                </Card>
                <Card>
                    {renderComponent()}
                </Card>
            </div>
        </div>
    )
}

export default NavBar