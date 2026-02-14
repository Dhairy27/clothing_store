# Troubleshooting MongoDB Connection

If you see an error like:
`Error connecting to MongoDB: ... SSL routines:ssl3_read_bytes:tlsv1 alert internal error ... SSL alert number 80`

**This means MongoDB Atlas blocked your connection because your IP address is not on the Allowlist.**

## How to Fix

1.  **Log in to MongoDB Atlas**
    Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and log in.

2.  **Go to Network Access**
    In the left sidebar, under "Security", click on **Network Access**.

3.  **Add IP Address**
    Click the **+ Add IP Address** button.

4.  **Allow Access**
    *   **Option A (Easiest for testing/deployment):** Click **Allow Access From Anywhere**. This adds `0.0.0.0/0` to the whitelist.
    *   **Option B (More Secure):** Click **Add Current IP Address** to only allow your current location. Note that if your deployment server has a different IP (like a cloud provider), this won't work for the server.

5.  **Confirm**
    Click **Confirm**. It may take a minute for the changes to deploy.

6.  **Restart Application**
    Once the status in Atlas shows "Active", restart your application.
