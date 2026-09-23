import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Verificar se o usuário é admin
        const user = await base44.auth.me();
        if (user?.role !== 'admin') {
            return Response.json(
                { error: 'Forbidden: Admin access required' },
                { status: 403 }
            );
        }

        const now = new Date();
        
        // Buscar todos os usuários com planos não-FREE
        const allUsers = await base44.asServiceRole.entities.User.list();
        
        let updatedCount = 0;
        
        for (const user of allUsers) {
            // Verificar se o usuário tem plano não-FREE e data de expiração
            if (user.plan !== 'FREE' && user.plan_expires_at) {
                const expiresAt = new Date(user.plan_expires_at);
                
                // Se a data de expiração já passou
                if (expiresAt < now) {
                    await base44.asServiceRole.entities.User.update(user.id, {
                        plan: 'FREE',
                        plan_updated_at: now.toISOString(),
                        plan_expires_at: now.toISOString()
                    });
                    
                    console.log(`Plano do usuário ${user.email} (${user.id}) expirou e foi alterado para FREE.`);
                    updatedCount++;
                }
            }
        }

        return Response.json({
            success: true,
            message: `Verificação de planos expirados concluída. ${updatedCount} planos atualizados.`,
            updated_count: updatedCount
        });

    } catch (error) {
        console.error('Erro na verificação de planos expirados:', error);
        return Response.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
});