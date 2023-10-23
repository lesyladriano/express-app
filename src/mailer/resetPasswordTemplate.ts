export const resetEmailTemplate = (
    token: string,
)=>{
    return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 20px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="color: #666;">You have requested a password reset for your account.</p>
        <p style="color: #666;">To reset your password, please use the following token:</p>
        <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h3 style="color: #333; margin-bottom: 10px;">Reset Token:</h3>
            <p style="color: #333; font-size: 18px;"><strong>${token}</strong></p>
        </div>
        <p style="color: #666;">This token will expire in {expirationTime} minutes.</p>
        <p style="color: #666;">If you did not request a password reset, please disregard this email.</p>
        <p style="color: #666;">Thank you for using our service!</p>
    </div>
    `;
}