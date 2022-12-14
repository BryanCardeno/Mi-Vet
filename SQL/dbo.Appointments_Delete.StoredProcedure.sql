USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[Appointments_Delete]    Script Date: 11/15/2022 12:38:21 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Bryan Cardeno
-- Create date: September 22, 2022
-- Description: Proc for deleting an appointment by udpating statusId
-- Code Reviewer:

-- MODIFIED BY: author
-- MODIFIED DATE: 09/22/2022
-- Code Reviewer:
-- Note:
-- =============================================
CREATE PROC [dbo].[Appointments_Delete]
			@Id int
AS
/*
--------TEST CODE--------
DECLARE @Id int = 3

SELECT *
FROM dbo.Appointments
WHERE [Id] = @Id

EXECUTE dbo.Appointments_Delete
			@Id

SELECT *
FROM dbo.Appointments
WHERE [Id] = @Id


*/

BEGIN

	UPDATE dbo.Appointments
	SET [StatusTypeId] = 5
	WHERE [Id] = @Id

END
GO
