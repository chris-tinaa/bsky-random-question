import { google } from "googleapis";
export async function getGoogleAuth(scopes: string[]) {
    const credentialsBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!credentialsBase64) {
        throw new Error('Google credentials not found in environment variables.');
    }

    const credentials = JSON.parse(Buffer.from(credentialsBase64, 'base64').toString('utf-8'));

    return await google.auth.getClient({
        projectId: "looting-corner",
        credentials: credentials,
        scopes,
    });
}

export async function getSheetData() {
    try {
        const auth = await getGoogleAuth(["https://www.googleapis.com/auth/spreadsheets"]);
        const sheets = google.sheets({ version: "v4", auth });

        const spreadsheetId = "1qd9Ee2XGX0n3qxOba7kQALiQQ9Y3NPxqkNnJmI8IowM";
        const sourceSheetName = 'Form Responses 1';
        const destinationSheetName = 'History';

        // Get the sheet metadata to find the sheet ID
        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId: spreadsheetId,
        });

        const sourceSheet = spreadsheet.data.sheets?.find(sheet => sheet.properties?.title === sourceSheetName);
        if (!sourceSheet || !sourceSheet.properties?.sheetId) {
            throw new Error(`Sheet with name "${sourceSheetName}" not found.`);
        }

        const sourceSheetId = sourceSheet.properties.sheetId;

        // Get data from source sheet
        const sourceRange = `${sourceSheetName}!A2:C2`;  // Adjust the range as needed to get only the top row
        const dataResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: sourceRange,
        });

        const rows = dataResponse.data.values;

        if (!rows || rows.length === 0) {
            console.log("No data found.");
            return '';
        } else {
            const currentDate = new Date().toLocaleString('en-US', { 
                month: 'numeric', 
                day: 'numeric', 
                year: 'numeric', 
                hour: 'numeric', 
                minute: 'numeric', 
                second: 'numeric',
                hour12: false // 24-hour format
            });
            rows.forEach(row => row.push(`${currentDate}`));
        }

        // Append data to destination sheet
        const destinationRange = `${destinationSheetName}!A2`;  // Adjust the range as needed
        await sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId,
            range: destinationRange,
            valueInputOption: 'RAW',
            requestBody: {
                values: rows,
            },
        });

        // Clear data from the first row of source sheet
        const clearRange = `${sourceSheetName}!A2:C2`;
        await sheets.spreadsheets.values.clear({
            spreadsheetId: spreadsheetId,
            range: clearRange,
        });

        if (rows[0][2]) {
            return 'jwb! '+ rows[0][2];
        } else {
            return '';
        }
        
    } catch (error: any) {
        console.error("Error fetching sheet data:", error.message);
        return '';
    }
}
