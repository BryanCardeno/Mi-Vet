const sampleAvailability = [
    {
        dayOfWeek: 1,
        startTime: "09:30",
        endTime: "16:30"
    },
    {
        dayOfWeek: 2,
        startTime: "08:00",
        endTime: "12:30"
    },
    {
        dayOfWeek: 3,
        startTime: "09:30",
        endTime: "17:30"
    },
    {
        dayOfWeek: 4,
        startTime: "07:30",
        endTime: "15:30"
    },
    {
        dayOfWeek: 5,
        startTime: "09:00",
        endTime: "17:00"
    },
]

const minIncrement = ["00", "30"];

const mapTimeAvailability = (startTime, endTime) => {
    let startColonIndex = startTime.indexOf(":");
    let startHour = Number(startTime.substring(0,startColonIndex));
    let startMin = startTime.substring(startColonIndex + 1);

    let endColonIndex = endTime.indexOf(":")
    let endHour = Number(endTime.substring(0, endColonIndex));
    let endMin = endTime.substring(endColonIndex + 1);

    let looped = [];

    for (let i = startHour; i < endHour; i++) {
      
      for (let j = 0; j < minIncrement.length; j++) {
        
        looped.push(`${i}:${minIncrement[j]}`)
      }
    }

    if(startMin === "30") {
      looped.shift();
    }

    if(endMin === "30") {
      looped.push(`${endHour}:00`)
    }

    return looped;
}

  var filterAvailability = day => {

    if(day) {
        let filter = sampleAvailability.filter(element => element.dayOfWeek === day)
        return filter;
    }
    else {
        return;
    }

  }

  export  {mapTimeAvailability, filterAvailability}