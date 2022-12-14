USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[Appointments_Select_ById]    Script Date: 11/15/2022 12:38:21 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Bryan Cardeno
-- Create date: September 22, 2022
-- Description: Get appointment info by Id. Only returns Active status/ StatusId 1
-- Code Reviewer:

-- MODIFIED BY: author
-- MODIFIED DATE: 09/29/2022
-- Code Reviewer: Adam Leymeister
-- Note: Updated Status Type, Appointment Type, and Locations returns
-- =============================================

CREATE PROC [dbo].[Appointments_Select_ById]
			@Id int
AS

/*
--------- TEST CODE ----------
DECLARE @Id int = 64;

EXECUTE dbo.Appointments_Select_ByID @Id

SELECT *
FROM dbo.Appointments
*/

BEGIN

	SELECT 
			a.[Id]
			,a.[Notes]
			,a.[IsConfirmed]
			,a.[AppointmentStart]
			,a.[AppointmentEnd]
			,a.[DateCreated]
			,a.[DateModified]
			,StatusType = (SELECT
								st.[Id]
								,st.[Name]
							FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)

			,AppointmentType = (SELECT 
										apt.[Id]
										,apt.[Name]
								FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)

			,ModifiedBy = (SELECT 
								u.[Id]
								,u.[FirstName]
								,u.[LastName]
								,u.[Email]
							FROM dbo.Users as u
							WHERE a.ModifiedBy = u.Id
							FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)

			,Location = (SELECT 
								l.[Id]
								,l.[LineOne]
								,l.[LineTwo]
								,l.[City]
								,l.[Zip]
								,l.[Longitude]
								,l.[Latitude]
								,LocationType = JSON_QUERY((SELECT 
																	lt.[Id]
																	,lt.[Name]
															FOR JSON PATH, WITHOUT_ARRAY_WRAPPER))

								,State = JSON_QUERY((SELECT 
															s.[Id]
															,s.[Name]
													FOR JSON PATH, WITHOUT_ARRAY_WRAPPER))

						FROM dbo.Locations as l
						INNER JOIN dbo.States as s
						ON l.StateId = s.Id
						INNER JOIN dbo.LocationTypes as lt
						ON l.LocationTypeId = lt.Id
						WHERE l.Id = a.LocationId
						FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)

			,Client = (SELECT 
								u.[Id]
								,u.[FirstName]
								,u.[LastName]
								,u.[Email]
						FROM dbo.Users AS u
						WHERE u.Id = a.ClientId
						FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER)

			,CreatedBy = (SELECT 
								u.[Id]
								,u.[FirstName]
								,u.[LastName]
							FROM dbo.Users AS u
							WHERE u.Id = a.CreatedBy
							FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER)

			,Vet = (SELECT 
							vp.[Id]
							,vp.[Bio]
							,vp.[BusinessEmail]
							,vp.[EmergencyLine]
					FROM dbo.VetProfiles AS vp
					WHERE a.VetProfileId = vp.Id
					FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER)

	FROM dbo.Appointments AS a
	INNER JOIN dbo.StatusTypes AS st
	ON a.StatusTypeId = st.Id
	INNER JOIN dbo.AppointmentTypes AS apt
	ON a.AppointmentTypeId = apt.Id
	WHERE a.Id = @Id 
			--AND 
			--a.StatusTypeId = 1

END
GO
