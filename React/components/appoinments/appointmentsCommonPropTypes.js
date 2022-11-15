import PropTypes from "prop-types";

const userProp = PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
})

const locationProp = PropTypes.shape({
    lineOne: PropTypes.string.isRequired,
    lineTwo: PropTypes.string, //optional address line
    city: PropTypes.string.isRequired,
    zip: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    state: PropTypes.shape({
        name: PropTypes.string.isRequired,
    })
})

const vetProfileProp = PropTypes.shape({
    id: PropTypes.number.isRequired,
    bio: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    emergencyLine: PropTypes.string,
    businessEmail: PropTypes.string,
    createdBy: userProp,
    location: locationProp,
    scheduledAvailabilities: PropTypes.arrayOf(Object),
    services: PropTypes.arrayOf(Object)
    
});


export {userProp, 
    locationProp, 
    vetProfileProp};