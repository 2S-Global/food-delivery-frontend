export const validateDocuments = (formData) => {
    const {
        jobTitle,
        jobDescription,
        getApplicationUpdateEmail,
        positionAvailable,
        jobType,
        jobExpiryDate,
        jobLocationType,
        salary,
        careerLevel,
        experienceLevel,
        industry,
        qualification,
        advertiseCity,
        advertiseCityName,
        country,
        city,
        branch,
        address
    } = formData;

    // Validate Job Title
    if (!jobTitle || jobTitle.trim() === "") {
        return { field: "jobTitle", message: "Please enter Job Title." };
    }

    if (!jobDescription || jobDescription.trim() === "") {
        return { field: "jobDescription", message: "Please enter Job Description." };
    }

    if (!getApplicationUpdateEmail || getApplicationUpdateEmail.trim() === "") {
        return { field: "getApplicationUpdateEmail", message: "Get application updates is required." };
    }

    if (!positionAvailable || positionAvailable.trim() === "") {
        return { field: "positionAvailable", message: "Please enter Number of Positions Available." };
    }


    // Validate Job Type

    if (!Array.isArray(jobType) || jobType.length === 0) {
        return { field: "jobType", message: "Please select at least one Job Type." };
    }

    // Validate Job Expiry Date
    if (!jobExpiryDate || isNaN(new Date(jobExpiryDate).getTime())) {
        return { field: "jobExpiryDate", message: "Please enter a valid Job Expiry Date." };
    }

    // Salary validation (if needed)
    if (!salary || !salary.structure || !salary.currency || !salary.rate) {
        return { field: "salaryStructure", message: "Please fill out all required salary details." };
    }

    const { structure, currency, min, max, amount, rate } = salary;

    switch (structure) {
        case "range":
            if (!currency || min == null || max == null || !rate) {
                return {
                    field: "salaryStructure",
                    message: "For salary range, currency, min, max, and rate are required.",
                };
            }
            break;

        case "starting amount":
        case "maximum amount":
        case "exact amount":
            if (!currency || amount == null || !rate) {
                return {
                    field: "salaryStructure",
                    message: `For salary '${structure}', currency, amount, and rate are required.`,
                };
            }
            break;

        default:
            return { field: "salaryStructure", message: "Invalid salary structure." };
    }

    // Validate Career Level
    if (!careerLevel || careerLevel.trim() === "") {
        return { field: "careerLevel", message: "Please select Career Level." };
    }

    // Validate Experience Level
    if (!experienceLevel || experienceLevel.trim() === "") {
        return { field: "experienceLevel", message: "Please select Experience Level." };
    }

    // Validate Industry
    if (!industry || industry.trim() === "") {
        return { field: "industry", message: "Please select Industry." };
    }

    //qualification
    if (!Array.isArray(qualification) || qualification.length === 0) {
        return { field: "qualification", message: "Please select at least one Qualification." };
    }

    // Validate Job Location Type
    if (!jobLocationType || jobLocationType.trim() === "") {
        return { field: "jobLocationType", message: "Please select a Job Location Type." };
    }

    // Handle Remote Job Location Logic
    if (jobLocationType === "remote") {
        if (!advertiseCity) {
            return { field: "advertiseCity", message: "Please select whether you want to advertise your job in a specific city." };
        }

        if (advertiseCity === "Yes" && (!advertiseCityName || advertiseCityName.trim() === "")) {
            return { field: "advertiseCityName", message: "Please enter the city where you want to advertise this job." };
        }
    }

    // Handle On-site Job Location Logic
    if (jobLocationType === "on-site") {
        if (!country || country.trim() === "") return { field: "country", message: "Please select a country." };
        if (!city || city.trim() === "") return { field: "city", message: "Please select a city." };
        if (!branch || branch.trim() === "") return { field: "branch", message: "Please select a branch." };
        if (!address || address.trim() === "") return { field: "address", message: "Please enter a complete address." };
    }
    
    return null;
};
