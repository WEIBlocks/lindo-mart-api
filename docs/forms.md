# Lindo Mart Forms - Schema Overview

This document provides a detailed explanation of the schemas for each form used in the Lindo Mart Process Automation project.

## 1. **Slow Moving Item Alert Form Schema**
- **Employee Submitting:** Name of the employee submitting the form.
- **For Date:** Date for which the form is submitted.
- **Date Submitted:** Timestamp when the form is submitted.
- **Item Name:** Name of the slow-moving item.
- **Item Description:** Detailed description of the item.
- **Size:** Size of the item (e.g., small, medium, large).
- **Quantity:** Quantity of the item.
- **Batch/Invoice #:** Associated batch or invoice number.
- **Date Received:** Date when the item was received.
- **Units Sold to Date:** The number of units sold for the item to date.

The purpose of this form is to identify and track slow-moving items in inventory and trigger alerts when intervention is needed.

---

## 2. **Essentials Alert Form Schema**
- **Employee Submitting:** Name of the employee submitting the form.
- **For Date:** Date for which the form is submitted.
- **Date Submitted:** Timestamp when the form is submitted.
- **Item Name:** Name of the item being reported.
- **Item Description:** Detailed description of the item.
- **Action Needed:** Action required to address the alert (e.g., reorder, discard, investigate).
- **Categories of Alerts:**
  - Critical Quality Concern
  - Non-critical Quality Concern
  - Price Concern
  - Damaged Item Alert
  - Customer Service Feedback

The form serves to report and track essential inventory and operational alerts that require immediate attention.

---

## 3. **Equipment/Facility Alert Form Schema**
- **Employee Submitting:** Name of the employee submitting the form.
- **For Date:** Date of submission.
- **Date Submitted:** Timestamp when the form is submitted.
- **Issue Class:** Type of issue (e.g., equipment failure, maintenance required).
- **Issue Description:** Detailed description of the issue.
- **Action Needed:** Action required to resolve the issue (e.g., repair, replacement, service).

This form is used to track equipment or facility-related issues that require quick resolution.

---

## 4. **Reminder/Follow Up Form Schema**
- **Employee Submitting:** Name of the employee submitting the form.
- **For Date:** Date of submission.
- **Date Submitted:** Timestamp when the form is submitted.
- **Reminder Description:** Description of the task or process that requires a follow-up.
- **Follow-Up Action:** Action required for follow-up (e.g., reminder to contact customer, check inventory).

The form helps track tasks that need to be followed up, ensuring nothing is missed in operations.

---

## 5. **Handover Note Form Schema**
- **Employee Submitting:** Name of the employee submitting the form.
- **For Date:** Date of submission.
- **Date Submitted:** Timestamp when the form is submitted.
- **Task Description:** Description of the task being handed over.
- **Handover Notes:** Notes or comments related to the handover.
- **Action Needed:** Action that needs to be taken by the recipient.

This form helps to transfer tasks or items between employees and ensures continuity in operations.

---

## 6. **Customer Feedback Form Schema**
- **Employee Submitting:** Name of the employee submitting the feedback.
- **For Date:** Date of submission.
- **Date Submitted:** Timestamp when the form is submitted.
- **Customer Feedback:** Description of the feedback received (e.g., complaints, recommendations).
- **Feedback Category:** Categories of feedback (e.g., quality concern, price concern, customer service feedback).

This form captures feedback from customers to help improve customer service and product quality.

---

## 7. **Health & Safety Form Schema**
- **Employee Submitting:** Name of the employee submitting the form.
- **For Date:** Date of submission.
- **Date Submitted:** Timestamp when the form is submitted.
- **Issue Class:** Classification of the health and safety issue (e.g., hazardous material, unsafe practice).
- **Issue Description:** Detailed description of the issue.
- **Action Needed:** Action required to address the issue (e.g., immediate fix, investigation).

This form tracks health and safety-related issues and ensures compliance with safety standards.

---

> All forms need to be integrated into the backend system, triggering alerts and notifications based on specific actions required. These forms should be built with clear data validation to ensure that submitted data is consistent and actionable.