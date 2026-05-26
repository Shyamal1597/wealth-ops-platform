# Instructions to Fix PDF Downloads on IIS

The PDF download links are not working because the PDF files need to be copied to the IIS wwwroot directory. This requires administrator permissions.

## Option 1: Run PowerShell Script as Administrator (RECOMMENDED)

1. Right-click on **Windows Start Menu**
2. Select **"Windows PowerShell (Admin)"** or **"Terminal (Admin)"**
3. When prompted by UAC, click **"Yes"**
4. Run the following command:

```powershell
cd C:\Users\SSFL-RETAIL-017\sunidhi-nextjs
.\COPY_PDFS_TO_IIS.ps1
```

5. Press any key when the script completes
6. Test the PDF downloads at http://localhost/legal/disclosure-disclaimer

## Option 2: Run Batch File as Administrator

1. Navigate to: `C:\Users\SSFL-RETAIL-017\sunidhi-nextjs`
2. Right-click on **`COPY_PDFS_TO_IIS.bat`**
3. Select **"Run as administrator"**
4. Click **"Yes"** when prompted by UAC
5. Press any key when done
6. Test the PDF downloads

## Option 3: Manual Copy (If scripts don't work)

1. Open **Windows Explorer** as Administrator:
   - Press `Win + R`
   - Type: `explorer`
   - Press `Ctrl + Shift + Enter` (this opens as admin)

2. Navigate to: `C:\Users\SSFL-RETAIL-017\sunidhi-nextjs\public\legal-documents`

3. Select all 5 PDF files (Ctrl+A)

4. Copy them (Ctrl+C)

5. Navigate to: `C:\inetpub\wwwroot`

6. Create a new folder called `legal-documents` (if it doesn't exist)

7. Open the `legal-documents` folder

8. Paste the files (Ctrl+V)

## Verify It Works

After completing any of the above options, test these URLs in your browser:

- http://localhost/legal-documents/SUNIDHI_DISCLAIMER_WEBSITE_Final_Aug_11_2023.pdf
- http://localhost/legal-documents/Annexure-I-Advisory-for-KYC-updation.pdf
- http://localhost/legal-documents/Investor_charter_DP.pdf
- http://localhost/legal-documents/Investor_Charter_in_respect_of_Research_Analyst_(RA).pdf
- http://localhost/legal-documents/1679937760Investor_complaints_Depository_Participant_Sunidhi.pdf

All download links on the Legal pages should now work!

## Why This is Needed

IIS (Internet Information Services) is serving your website from `C:\inetpub\wwwroot`, not from the Next.js project folder. The PDF files exist in your Next.js project's `public` folder, but IIS cannot access them from there. They need to be copied to the IIS wwwroot directory.

## Note

The website's HTML/CSS/JS files are probably being served through a different mechanism (possibly a reverse proxy or the Next.js server running in the background). Only the static PDF files need this manual copy step for IIS to serve them.
