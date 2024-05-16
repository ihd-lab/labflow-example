import { example_email_address } from "./constants"
import { ORDER_STATUS } from "./models"

/**
 * Get a pre-populated version of the return values, based on the request and response.
 * @param {Request | undefined} request
 * @param {Response | undefined} response
 * @returns {string, Object, Object, string} - Returns the API call, response object, data object, and output string.
 */
export const getReturnValues = async (request, response) => {
  let output, data

  if (!request) {
    return {
      apiCall: `N/A`,
      response: null,
      data: null,
      output: "Request is missing",
    }
  }

  if (!response) {
    return {
      apiCall: `N/A`,
      response: null,
      data: null,
      output: "Response is missing",
    }
  }

  if (response.status !== 200) {
    output = `[${response.status}] Error during API call ` + response.statusText
  }

  data = await response.json()

  return {
    apiCall: `[${response.status}] ${request.method} ${request.url}`,
    response: response,
    data: data,
    output: output || "Success",
  }
}

/**
 * Fetches configured kits from the API.
 * @param {string | undefined} panelId - If a panel is provided, only return this panel.
 * @returns {Promise<{string, Object, Object, string}>} A promise that resolves to API call, response object, data object, and output string.
 */
export const getConfiguredKits = async (panelId) => {
  const { api_key, endpoint_uri } = getConfiguration()

  const request = new Request(`${endpoint_uri}/kit`, {
    method: "GET",
    headers: {
      "x-api-key": api_key,
      "Content-Type": "application/json",
    },
  })

  const response = await fetch(request)

  const ret = await getReturnValues(request, response)

  if (panelId) {
    let data = ret.data
    ret.data = panelId && data ? data.find((element) => element.panelId === panelId) : data
  }

  return ret
}

/**
 * Fetches the first configured kit from the API.
 * @returns {Promise<{string, Object, Object, string}>} A promise that resolves to API call, response object, data object, and output string.
 */
export const getFirstConfiguredKit = async () => {
  let { apiCall, response, data, output } = await getConfiguredKits()

  if (data?.length === 0) {
    output = "No kits found"
  } else {
    data = data[0]
  }

  return {
    apiCall: apiCall,
    response: response,
    data: data,
    output: output,
  }
}

async function __createKitOrder(endpoint_uri, api_key, samplePayload) {
  const request = new Request(`${endpoint_uri}/order/kit`, {
    method: "POST",
    headers: {
      "x-api-key": api_key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(samplePayload),
  })
  const response = await fetch(request)

  const ret = await getReturnValues(request, response)

  return ret
}

/**
 * Creates a kit order by ID.
 * @param {string} kitId - The ID of the kit to create an order for.
 * @returns {Promise<{string, Object, Object, string}>} A promise that resolves to API call, response object, data object, and output string.
 * @example
 * const { order, response } = await createKitOrderById("kit-12345678");
 */
export const createKitOrderById = async (kitId) => {
  const { api_key, endpoint_uri } = getConfiguration()

  const samplePayload = {
    kitId: kitId,
    customer: {
      firstName: "John",
      lastName: "Doe",
      middleName: "E.",
      email: example_email_address,
      phone: "+1-626-456-7890",
      shipping: {
        name: "John E. Doe",
        street1: "123 Main St.",
        street2: "Apt 4B",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
      },
      billing: {
        name: "John E. Doe",
        street1: "123 Main St.",
        street2: "Apt 4B",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
      },
    },
  }

  return await __createKitOrder(endpoint_uri, api_key, samplePayload)
}

export const createFailedKitOrderById = async (kitId) => {
  const { api_key, endpoint_uri } = getConfiguration()

  const samplePayload = {
    kitId: kitId,
    customer: {
      firstName: "John",
      lastName: "Doe",
      middleName: "E.",
      email: example_email_address,
      shipping: {
        name: "John E. Doe",
        street1: "123 Main St.",
        street2: "Apt 4B",
        city: "New York",
        state: "NY",
        postalCode: "XXXXX",
        country: "USA",
      },
      billing: {
        name: "John E. Doe",
        street1: "123 Main St.",
        street2: "Apt 4B",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
      },
    },
  }

  return await __createKitOrder(endpoint_uri, api_key, samplePayload)
}

/**
 * Create a Lab Order
 * @param {string} kitId
 * @returns {Promise<{string, Object, Object, string}>} A promise that resolves to API call, response object, data object, and output string.
 * @remarks This method can take longer, because it also includes sending the order to the lab integration.
 */
export const createLabOrderById = async (kitId, testType) => {
  const { api_key, endpoint_uri } = getConfiguration()

  const samplePayload = {
    kitId: kitId,
    externalId: "12345678",
    patient: {
      firstName: "John",
      lastName: "Doe",
      middleName: "E.",
      //
      email: example_email_address,
      phone: "+1-626-456-7890",
      dob: "04-30-1979",
      gender: "Male",
      //
      address: {
        name: "John E. Doe",
        street1: "123 Main St.",
        street2: "Apt 4B",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
      },
    },
    dateCreated: new Date().toISOString(), // can be any valid ISO string
    dateRegistered: new Date().toISOString(), // can be any valid ISO string
  }

  return await __createLabOrder(endpoint_uri, api_key, samplePayload, testType)
}

export const createLabOrderByIdResulted = (kitId) => createLabOrderById(kitId, "RESULTED")
export const createLabOrderByIdRejected = (kitId) => createLabOrderById(kitId, "REJECTED")

async function __createLabOrder(endpoint_uri, api_key, samplePayload, testType) {
  const uri = testType
    ? `${endpoint_uri}/order/lab?test=true&testType=${testType}`
    : `${endpoint_uri}/order/lab`

  const request = new Request(uri, {
    method: "POST",
    headers: {
      "x-api-key": api_key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(samplePayload),
  })

  const response = await fetch(request)

  const ret = await getReturnValues(request, response)

  return ret
}

/**
 * Create an example of a failed order order; showing the error messages.
 * @param {string} kitId
 * @returns {Promise<{string, Object, Object, string}>} A promise that resolves to API call, response object, data object, and output string.
 */
export const createFailedLabOrderById = async (kitId) => {
  const { api_key, endpoint_uri } = getConfiguration()

  const samplePayload = {
    kitId: kitId,
    patient: {
      firstName: "John",
      middleName: "E.",
      // missing last name
      email: example_email_address,
      phone: "+1-626-456-7890",
      dob: "04-31-1979", // invalid date
      gender: "Maler", // invalid gender
      //
      address: {
        name: "John E. Doe",
        state: "NY",
        postalCode: "10001",
        country: "USA",
        // missing street address
      },
    },
    dateCreated: new Date().toISOString(), // can be any valid ISO string
    dateRegistered: new Date().toISOString(), // can be any valid ISO string
  }

  return await __createLabOrder(endpoint_uri, api_key, samplePayload)
}

/**
 * Fetches an order by ID.
 * @param {string} orderId
 * @param {boolean | undefined} isComplete
 * @returns {Promise<{string, Object, Object, string}>} A promise that resolves to API call, response object, data object, and output string.
 */
export const getOrderById = async (orderId, isComplete) => {
  const { api_key, endpoint_uri } = getConfiguration()

  if (!orderId) {
    let ret = await getReturnValues()
    ret.output = "Order Id is required"
    return ret
  }

  const url = isComplete
    ? `${endpoint_uri}/order/${orderId}?complete=true`
    : `${endpoint_uri}/order/${orderId}`
  const request = new Request(url, {
    method: "GET",
    headers: {
      "x-api-key": api_key,
      "Content-Type": "application/json",
    },
  })

  const response = await fetch(request)

  const ret = await getReturnValues(request, response)

  return ret
}

/**
 * Cancels an order by ID.
 * @param {string} orderId
 * @returns {Promise<{string, Object, Object, string}>} A promise that resolves to API call, response object, data object, and output string.
 */
export const cancelOrderById = async (orderId) => {
  const { api_key, endpoint_uri } = getConfiguration()

  const request = new Request(`${endpoint_uri}/order/${orderId}`, {
    method: "DELETE",
    headers: {
      "x-api-key": api_key,
      "Content-Type": "application/json",
    },
  })

  const response = await fetch(request)

  const ret = await getReturnValues(request, response)

  return ret
}

/**
 * Get inbox orders
 * @returns {Promise<{string, Object, Object, string}>} A promise that resolves to API call, response object, data object, and output string.
 */
export const getInbox = async () => {
  const { api_key, endpoint_uri } = getConfiguration()

  const request = new Request(`${endpoint_uri}/inbox`, {
    method: "GET",
    headers: {
      "x-api-key": api_key,
      "Content-Type": "application/json",
    },
  })

  const response = await fetch(request)

  const ret = await getReturnValues(request, response)

  if (ret.data?.length === 0) {
    ret.output = "No inbox messages found"
  } else {
    ret.output = `Found ${ret.data.length} inbox messages`
  }

  return ret
}

/**
 * Clear all inbox orders
 * @returns {Promise<{string, Object, Object, string}>} A promise that resolves to API call, response object, data object, and output string.
 */
export const clearInbox = async (orderId) => {
  const { api_key, endpoint_uri } = getConfiguration()

  const uri = orderId ? `${endpoint_uri}/inbox/${orderId}` : `${endpoint_uri}/inbox`
  const request = new Request(uri, {
    method: "DELETE",
    headers: {
      "x-api-key": api_key,
      "Content-Type": "application/json",
    },
  })

  const response = await fetch(request)
  const ret = await getReturnValues(request, response)

  return ret
}

/**
 * Example of processing inbox messages, fetching more details when necessary.
 * @param {boolean} clearAfterProcessing
 * @returns {Promise<{string, Object, Object, string}>} A promise that resolves to API call, response object, data object, and output string.
 */
export const processInbox = async (clearAfterProcessing) => {
  /**
   * An example showing when fetching additional details are interesting.
   * @returns {Promise<Object>} A promise that resolves to an object containing the processed inbox.
   * @example
   * const { apiCall, response, data, output } = await processInbox();
   */
  const { api_key, endpoint_uri } = getConfiguration()

  const request = new Request(`${endpoint_uri}/inbox`, {
    method: "GET",
    headers: {
      "x-api-key": api_key,
      "Content-Type": "application/json",
    },
  })

  const response = await fetch(request)

  const ret = await getReturnValues(request, response)

  if (ret.data?.length === 0) {
    return ret
  }

  let processedOutput = ""
  const orders = ret.data
  for (const order of orders) {
    const status = order.status

    switch (status) {
      case ORDER_STATUS.NEW: // nothing to do
        processedOutput += `${order.id}: ${order.status}\n`
        break

      // shipping statuses that aren't particularly actionable
      case ORDER_STATUS.ADDED_TO_BATCH:
      case ORDER_STATUS.PENDING_DELIVERY:
      case ORDER_STATUS.IN_TRANSIT:
        processedOutput += `${order.id}: ${order.status}\n`
        break

      // possibly communicate to patient/customer
      case ORDER_STATUS.OUT_FOR_DELIVERY:
      case ORDER_STATUS.DELIVERED:
        processedOutput += `${order.id}: ${order.status}\n`
        break

      // internal escalation; contact customer service
      case ORDER_STATUS.DELIVERY_FAILED:
      case ORDER_STATUS.DELIVERY_ERROR:
        processedOutput += `${order.id}: ${order.status}\n`
        break

      case ORDER_STATUS.CANCELATION_REQUESTED:
        processedOutput += `${order.id}: ${order.status}\n`
        break

      // This could be a pure cancellation or a rejection (QNS, expired sample, etc.)
      // We only have to fetch additional details from the inbox when the status has changed to something
      // with additional information.
      case ORDER_STATUS.CANCELLED:
        let cr = await getOrderResults(order.id)
        processedOutput +=
          `${order.id}: ${order.status} – ` + (cr ? JSON.stringify(cr) : "No results") + "\n"
        break

      // When the patient has registered, you can send a thank you to the patient for registering
      case ORDER_STATUS.REGISTERED:
        processedOutput += `${order.id}: ${order.status}\n`
        break

      case ORDER_STATUS.RECEIVED:
        processedOutput += `${order.id}: ${order.status}\n`
        break

      // This status is specific to lab orders
      case ORDER_STATUS.PROCESSING:
        processedOutput += `${order.id}: ${order.status}\n`
        break

      // This is a final resulted status.
      // Note: We only have to fetch additional details from the inbox when the status has changed to something with additional information.
      case ORDER_STATUS.RESULTED:
        // Get order
        let r = await getOrderResults(order.id)
        processedOutput +=
          `${order.id}: ${order.status} – ` + (r ? JSON.stringify(r) : "No results") + "\n"

        break

      case ORDER_STATUS.HOLD:
        processedOutput += `${order.id}: ${order.status}\n`
        break

      default:
        break
    }

    // Typically, if you handled all messages you would clear the entire inbox in one call.
    // This is an example for clearing them individually, in the case that you can't handle
    // a specific message at the time you are calling the process.
    if (clearAfterProcessing) {
      await clearInbox(order.id)
      processedOutput += `Cleared inbox for order ${order.id}\n`
    }
  }

  ret.output = processedOutput

  return ret
}

/**
 * Get the registration code of an order.
 * @param {*} orderId
 * @returns {Promise<{string, Object, Object, string}>} A promise that resolves to API call, response object, data object, and output string.
 */
export const getRegistrationCode = async (orderId) => {
  if (!orderId) {
    let ret = await getReturnValues()
    ret.output = "Order Id is required"
    return ret
  }

  const ret = await getOrderById(orderId)
  const orderData = ret.data

  if (!orderData) {
    ret.output = "Order not found"
  } else if (orderData?.kit.registrationCode === undefined) {
    ret.output = "Only kit orders can be mocked via registration"
  }

  return ret
}

/**
 * Register an order with a registration code.
 * Optional mocking via the testType parameter.
 * @param {string} registrationCode
 * @param {string | undefined} testType
 * @returns {Promise<{string, Object, Object, string}>} A promise that resolves to API call, response object, data object, and output string.
 */
export const registerOrder = async (registrationCode, testType) => {
  const { api_key, endpoint_uri } = getConfiguration()

  if (!registrationCode) {
    let ret = await getReturnValues()
    ret.output = "Registration Code is required"
    return ret
  }

  const registrationPayload = {
    registrationCode: registrationCode,
    patient: {
      firstName: "John",
      lastName: "Doe",
      middleName: "E.",
      //
      email: example_email_address,
      phone: "+1-626-456-7890",
      dob: "04-30-1979",
      gender: "Male",
      //
      address: {
        name: "John E. Doe",
        street1: "123 Main St.",
        street2: "Apt 4B",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
      },
    },
  }

  const uri = testType
    ? `${endpoint_uri}/order/register?test=true&testType=${testType}`
    : `${endpoint_uri}/order/register`
  const request = new Request(uri, {
    method: "PUT",
    headers: {
      "x-api-key": api_key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registrationPayload),
  })

  const response = await fetch(request)
  const ret = await getReturnValues(request, response)

  return ret
}

export const addMockKitReceived = (registrationCode) => registerOrder(registrationCode, "RECEIVED")
export const addMockResults = (registrationCode) => registerOrder(registrationCode, "RESULTED")
export const addMockRejections = (registrationCode) => registerOrder(registrationCode, "REJECTED")

const getOrderResults = async (orderId) => {
  const orderResponse = await getOrderById(orderId)
  const orderData = orderResponse.data

  return orderData?.accession?.results
}

const getConfiguration = () => {
  if (!process.env.REACT_APP_LABFLOW_X_API_KEY) {
    return Error("REACT_APP_LABFLOW_X_API_KEY is missing")
  }
  // check for the presence of process.env.REACT_APP_LABFLOW_ENDPOINT
  if (!process.env.REACT_APP_LABFLOW_ENDPOINT) {
    return Error("REACT_APP_LABFLOW_X_API_KEY is missing")
  }

  return {
    api_key: process.env.REACT_APP_LABFLOW_X_API_KEY,
    endpoint_uri: process.env.REACT_APP_LABFLOW_ENDPOINT,
  }
}
