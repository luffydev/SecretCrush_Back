app.get('/csrf-token', csrfProtection, (request, ressource) => {
    ressource.json({success: true, token: request.csrfToken()});  // Même nom pour la propriété
});