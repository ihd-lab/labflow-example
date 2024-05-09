/*
 *  The purpose of this application:
 *  - To provide a simple demonstration of how to use the LabFlow API.
 *  - To visualize typical workflows encountered by partners (not all inclusive).
 *
 * This application is not intended be used in a production environment.
 * This application is not optimized for performance or security.
 * This application is not intended to demonstrate best practices in reactjs.
 */
import React, { useState, useEffect } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism"
import "./App.css"
import logo from "./images/labflow.png"

import {
  getConfiguredKits,
  getFirstConfiguredKit,
  createKitOrderById,
  createLabOrderById,
  createLabOrderByIdResulted,
  createLabOrderByIdRejected,
  createFailedLabOrderById,
  createFailedKitOrderById,
  getOrderById,
  cancelOrderById,
  getRegistrationCode,
  getInbox,
  clearInbox,
  processInbox,
  addMockKitReceived,
  addMockResults,
  addMockRejections,
  registerOrder,
} from "./App.backend"

function App() {
  const [apiCall, setApiCall] = useState("")
  const [output, setOutput] = useState("")
  const [outputConsole, setOutputConsole] = useState("")
  const [kitIdValue, setKitIdValue] = useState("")
  const [orderId, setOrderId] = useState("")
  const [panelIdValue, setPanelIdValue] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [clearAfterProcess, setClearAfterProcess] = useState(false)
  const [registrationCode, setRegistrationCode] = useState("")

  const populateOutput = (apiCall, response, output) => {
    setApiCall(apiCall)

    if (response) {
      setOutput(JSON.stringify(response, null, 2))
    } else {
      setOutput("")
    }
    setOutputConsole(output || "")
  }

  useEffect(() => {
    setOutputConsole(" ", " ", " ")
  }, [])

  const handleGetAllKits = async () => {
    // Get all kits
    populateOutput("Fetching configured kits...", "")

    const { apiCall, response, data, output } = await getConfiguredKits()
    console.trace(response)

    populateOutput(apiCall, data, output)
  }

  const handlePopulateFirstPanelId = async () => {
    // Get all kits and find the first one, then populate the panelId for subsequent actions
    populateOutput("Populating first panelId...")

    const { apiCall, response, data, output } = await getFirstConfiguredKit()
    console.trace(response)

    if (data) {
      setPanelIdValue(data?.panelId || "")
      populateOutput(apiCall, data, "Panel ID in the textbox")
    } else {
      populateOutput(apiCall, data, output)
    }
  }

  const handlePopulateKit = async () => {
    // Get all kits and find the one that matches the paneld provided, then populate the kitId for subsequent actions
    populateOutput("Populating kit by externalId...")

    const { apiCall, response, data, output } = await getConfiguredKits(panelIdValue)
    console.trace(response)

    if (data) {
      setKitIdValue(data?.kitId || "")
      populateOutput(apiCall, data, "Kit populated in the textbox")
    } else {
      populateOutput(apiCall, data, output)
    }
  }

  const handleCreateKitOrder = async () => {
    // Create a kit order, then populate the orderId for subsequent actions
    populateOutput("Creating kit order...")

    const { apiCall, response, data, output } = await createKitOrderById(kitIdValue)
    console.trace(response)

    if (data) {
      setOrderId(data.id || "")
    }

    populateOutput(apiCall, data, output)
  }

  const handleCreateLabOrder = async () => {
    // Create a lab order, then populate the orderId for subsequent actions
    populateOutput("Creating lab order...")

    const { apiCall, response, data, output } = await createLabOrderById(kitIdValue)
    console.trace(response)

    if (data) {
      setOrderId(data.id || "")
    }

    populateOutput(apiCall, data, output)
  }

  const handleCreateLabOrderResulted = async () => {
    // Create a lab order, then populate the orderId for subsequent actions
    populateOutput("Creating lab order with results...")

    const { apiCall, response, data, output } = await createLabOrderByIdResulted(kitIdValue)
    console.trace(response)

    if (data) {
      setOrderId(data.id || "")
    }

    populateOutput(apiCall, data, output)
  }

  const handleCreateLabOrderRejected = async () => {
    // Create a lab order, then populate the orderId for subsequent actions
    populateOutput("Creating lab order with rejections...")

    const { apiCall, response, data, output } = await createLabOrderByIdRejected(kitIdValue)
    console.trace(response)

    if (data) {
      setOrderId(data.id || "")
    }

    populateOutput(apiCall, data, output)
  }

  const handleCreateFailedKitOrder = async () => {
    // Create a lab order, then populate the orderId for subsequent actions
    populateOutput("Creating failed kit order ...")

    const { apiCall, response, data, output } = await createFailedKitOrderById(kitIdValue)
    console.trace(response)

    if (data) {
      setOrderId("")
    }

    populateOutput(apiCall, data, output)
  }

  const handleCreateFailedLabOrder = async () => {
    // Create a lab order, then populate the orderId for subsequent actions
    populateOutput("Creating failed order ...")

    const { apiCall, response, data, output } = await createFailedLabOrderById(kitIdValue)
    console.trace(response)

    if (data) {
      setOrderId("")
    }

    populateOutput(apiCall, data, output)
  }

  const handleGetOrder = async () => {
    // Get an order by orderId
    populateOutput("Fetching order...")

    const { apiCall, response, data, output } = await getOrderById(orderId, isComplete)
    console.trace(response)

    populateOutput(apiCall, data, output)
  }

  const handleCancelOrder = async () => {
    // Cancel an order by orderId
    populateOutput("Cancelling order...")

    const { apiCall, response, data, output } = await cancelOrderById(orderId)
    console.trace(response)

    populateOutput(apiCall, data, output)
  }

  const handlePopulateRegCode = async () => {
    // Populate the registration code for subsequent actions
    populateOutput("Populating registration code...")

    const { apiCall, response, data, output } = await getRegistrationCode(orderId)
    console.trace(response)

    if (data) {
      setRegistrationCode(data?.kit?.registrationCode || "")
      populateOutput(apiCall, data, "Registration code populated in the textbox")
    } else {
      populateOutput(apiCall, data, output)
    }
  }

  const handleGetInbox = async () => {
    populateOutput("Fetching inbox...")

    const { apiCall, response, data, output } = await getInbox()
    console.trace(response)

    populateOutput(apiCall, data, output)
  }

  const handleClearInbox = async () => {
    populateOutput("Clearing inbox...")

    const { apiCall, response, data, output } = await clearInbox()
    console.trace(response)

    populateOutput(apiCall, data, output)
  }

  const handleProcessInbox = async () => {
    populateOutput("Processing inbox...", "")

    const { apiCall, response, data, output } = await processInbox(clearAfterProcess)
    console.trace(response)

    populateOutput(apiCall, data, output)
  }

  const handleRegisterOrder = async () => {
    populateOutput("Registering order...")

    const { apiCall, response, data, output } = await registerOrder(registrationCode)
    console.trace(response)

    populateOutput(apiCall, data, output)
  }

  const handleAddMockReceived = async () => {
    populateOutput("Adding mock kit received...")

    const { apiCall, response, data, output } = await addMockKitReceived(registrationCode)
    console.trace(response)

    populateOutput(apiCall, data, output)
  }

  const handleAddMockResults = async () => {
    populateOutput("Adding mock results...")

    const { apiCall, response, data, output } = await addMockResults(registrationCode)
    console.trace(response)

    populateOutput(apiCall, data, output)
  }

  const handleAddMockRejections = async () => {
    populateOutput("Adding mock rejections...")

    const { apiCall, response, data, output } = await addMockRejections(registrationCode)
    console.trace(response)

    populateOutput(apiCall, data, output)
  }

  return (
    <div className="app-container">
      <header>
        <img src={logo} alt="Labflow Logo" />
        <a href="https://labflow.ihdlab.com" target="_blank" rel="noopener noreferrer">
          IHD Labflow Documentation
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="external-link-icon"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g id="Interface / External_Link">
                {" "}
                <path
                  id="Vector"
                  d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>{" "}
            </g>
          </svg>
        </a>
      </header>
      <hr />
      <div className="main-grid">
        <div className="actions-column">
          <div className="section">
            <h3>Section 1: Base Data</h3>
            <div className="split">
              <button onClick={handleGetAllKits}>Get Configured Kits</button>
              <button onClick={handlePopulateFirstPanelId}>Populate First Panel Id</button>
            </div>
          </div>
          <div className="section">
            <h3>Section 2: Creating an Order</h3>
            <div className="split">
              <input
                type="text"
                value={panelIdValue}
                onChange={(e) => setPanelIdValue(e.target.value)}
                placeholder="Panel ID"
              />
              <button onClick={handlePopulateKit}>Populate Kit by Panel Id</button>
            </div>
            <input
              type="text"
              value={kitIdValue}
              onChange={(e) => setKitIdValue(e.target.value)}
              placeholder="Kit ID"
            />
            <hr />
            <h5>Kit Orders</h5>
            <div className="split">
              <button onClick={handleCreateKitOrder}>Create Kit Order</button>
              <button onClick={handleCreateFailedKitOrder}>Create w/ Errors</button>
            </div>
            <hr />
            <h5>Lab Orders</h5>
            <div className="split">
              <button onClick={handleCreateLabOrder}>Create Lab Order</button>
              <button onClick={handleCreateFailedLabOrder}>Create w/ Errors</button>
            </div>
            <div className="split">
              <button onClick={handleCreateLabOrderResulted}>Create w/ Mock Results</button>
              <button onClick={handleCreateLabOrderRejected}>Create w/ Mock Rejections</button>
            </div>
          </div>
          <div className="section">
            <h3>Section 3: Managing an Order</h3>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Order ID"
            />
            <div className="split">
              <button onClick={handleGetOrder}>Get Order</button>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  id="complete-checkbox"
                  checked={isComplete}
                  onChange={() => setIsComplete(!isComplete)}
                />
                <label htmlFor="complete-checkbox">Get Complete</label>
              </div>
            </div>
            <div className="split">
              <button onClick={handleCancelOrder}>Cancel Order</button>
              <button onClick={handlePopulateRegCode}>Populate Registration Code</button>
            </div>
          </div>
          <div className="section">
            <h3>Section 4: Registering an Order (Kit Flow)</h3>
            <input
              type="text"
              value={registrationCode}
              onChange={(e) => setRegistrationCode(e.target.value)}
              placeholder="Registration Code"
            />
            <div className="split">
              <button onClick={handleRegisterOrder}>Register Order</button>
              <button onClick={handleAddMockReceived}>Add Mock Kit Received</button>
            </div>
            <div className="split">
              <button onClick={handleAddMockResults}>Add Mock Results</button>
              <button onClick={handleAddMockRejections}>Add Mock Rejections</button>
            </div>
          </div>
          <div className="section">
            <h3>Section 5: Inbox Management</h3>
            <div className="split">
              <button onClick={handleGetInbox}>Get Inbox</button>
              <button onClick={handleClearInbox}>Clear Inbox</button>
            </div>
            <div className="split">
              <button onClick={handleProcessInbox}>Process Inbox</button>
              <div>
                <div className="checkbox-label">
                  <input
                    type="checkbox"
                    id="cap-checkbox"
                    checked={clearAfterProcess}
                    onChange={() => setClearAfterProcess(!clearAfterProcess)}
                  />
                  <label htmlFor="cap-checkbox">Clear Each Processed</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="output-column">
          <h3>API Call</h3>
          <div className="output output-api">
            <SyntaxHighlighter language="json" style={okaidia}>
              {apiCall}
            </SyntaxHighlighter>
          </div>
          <h3>API Output</h3>
          <div className="output output-response">
            <SyntaxHighlighter language="json" style={okaidia}>
              {output}
            </SyntaxHighlighter>
          </div>
          <h3>Console</h3>
          <div className="output output-console">
            <SyntaxHighlighter language="json" style={okaidia}>
              {outputConsole}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
